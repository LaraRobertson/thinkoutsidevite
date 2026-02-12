import {
    Button,
    Flex,
    Input,
    SelectField,
    SwitchField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import {getUrl, uploadData} from "aws-amplify/storage";
import {IconClueDisplay} from "../../sharedComponents.tsx";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {getDefaultModalContent, createModalContent} from "../../../utils/modalHelpers.ts";

type GameClue = Schema["GameClue"]["type"];

type ClueFormState = Omit<GameClue, 'id' | 'createdAt' | 'updatedAt' | 'game'>;

export default function ClueForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ClueForm must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;

    console.log("zoneID (clue form): " + modalContent.zoneID);
    const action = modalContent.action;
    const clueID = modalContent.id;
    const zoneID = modalContent.zoneID;
    const gameID = modalContent.gameID;
    const gameDesigner = modalContent.gameDesigner;

    const initialStateCreateClue: ClueFormState = {
        gameID: gameID || '',
        gamePlayZoneID: zoneID,
        gameClueName: '',
        gameClueImage: '',
        gameClueText: '',
        gameClueIcon: '',
        order: 1,
        disabled: false
    };
    
    const [formCreateClueState, setFormCreateClueState] = useState<Partial<ClueFormState>>(initialStateCreateClue);

    function setInputCreateClue(key: keyof ClueFormState, value: string | number | boolean) {
        setFormCreateClueState({ ...formCreateClueState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateClueForm();
        }
    },[]);
    
    async function populateClueForm() {
        try {
            const client = dataService.getClient();
            const { data: cluesFromAPI } = await client.models.GameClue.get({ id: clueID || '' });
            if (cluesFromAPI) {
                setFormCreateClueState(cluesFromAPI);
            }
        } catch (err) {
            console.log('error fetching getGameClue', err);
        }
    }
    
    async function addClue() {
        if (!formCreateClueState.gameClueName) {
            window.alert("Clue Name is required");
            return;
        }
        if (!formCreateClueState.gameClueText) {
            window.alert("Clue Text is required");
            return;
        }
        try {
            const gameClue = { ...formCreateClueState,
                gameClueName: formCreateClueState.gameClueName!,
                gameClueText: formCreateClueState.gameClueText!,
                gamePlayZoneID: formCreateClueState.gamePlayZoneID!,
                gameID: formCreateClueState.gameID!,
                order: formCreateClueState.order || 0
            };
            const client = dataService.getAuthClient();
            const result = await client.models.GameClue.create(gameClue);
            
            if (result.errors) {
                console.error('Errors creating clue:', result.errors);
                window.alert("Error creating clue: " + JSON.stringify(result.errors));
                return;
            }

            setFormCreateClueState(initialStateCreateClue);
            /* close modal */
            setModalContent(createModalContent({ updatedDB: true }));
            window.alert("Clue created successfully!");
        } catch (err) {
            console.error('error creating clue:', err);
            window.alert("Error creating clue: " + err);
        }
    }
    
    async function updateClue() {
        if (!formCreateClueState.gameClueName) {
            window.alert("Clue Name is required");
            return;
        }
        try {
            const gameClue = { ...formCreateClueState, id: clueID! };
            const client = dataService.getAuthClient();
            const result = await client.models.GameClue.update(gameClue);
            
            if (result.errors) {
                console.error('Errors updating clue:', result.errors);
                window.alert("Error updating clue: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateClueState(initialStateCreateClue);
            /* close modal */
            setModalContent(getDefaultModalContent());
            window.alert("Clue updated successfully!");
        } catch (err) {
            console.error('error updating GameClue:', err);
            window.alert("Error updating clue: " + err);
        }
    }

    async function handleGameClueImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e?.target?.files) {
            const file = e.target.files[0];
            const sizeInKB = Math.round(file.size / 1024);

            if (sizeInKB > 100) {
                alert("file is too big - it is " + sizeInKB + 'KB. Must be less than 100KB');
            } else {
                const gameDesignerCleaned = removeFunction(gameDesigner || '');
                const filePath = "public/" + gameDesignerCleaned + "/clues/" + file.name;
                try {
                    await uploadData({
                        path: filePath,
                        data: file,
                        options: {
                            onProgress: ({transferredBytes, totalBytes}) => {
                                if (totalBytes) {
                                    console.log(
                                        `Upload progress ${
                                            Math.round((transferredBytes / totalBytes) * 100)
                                        } %`
                                    );
                                }
                            }
                        }
                    }).result;

                    const urlResult = await getUrl({ path: filePath });
                    setInputCreateClue('gameClueImage', urlResult.url.toString());
                } catch (error) {
                    console.log('Error : ', error);
                }
            }
        }
    }
    
    function removeFunction(inputString: string): string {
        return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }
    
    return (
        <View id="gameClueForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Clue Form</strong></View>
            <View className={"small"}>Game ID: {formCreateClueState.gameID}</View>
            <View className={"small"}>Zone ID: {formCreateClueState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                <SwitchField
                    label={formCreateClueState.disabled? "disabled" : "live"}
                    isChecked={formCreateClueState.disabled || false}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateClue('disabled', e.target.checked);
                    }}
                />
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateClue('order', parseInt(event.target.value))}
                    value={formCreateClueState.order?.toString() || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueName', event.target.value)}
                    name="gameClueName"
                    placeholder="Game Clue Name"
                    label="Game Clue Name"
                    variation="quiet"
                    value={formCreateClueState.gameClueName || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueText', event.target.value)}
                    name="gameClueText"
                    placeholder="Game Clue Text"
                    label="Game Clue Text"
                    variation="quiet"
                    value={formCreateClueState.gameClueText || ''}
                    required
                />
                <SelectField
                    className={"city-dropdown"}
                    label="Game Clue Icon"
                    placeholder="choose an icon"
                    value={formCreateClueState.gameClueIcon || ''}
                    onChange={(event) => setInputCreateClue('gameClueIcon', event.target.value)}>
                        <option key={"1"} value={"clueIcon"}>clueIcon</option>
                        <option key={"2"} value={"tornPaper"}>tornPaper</option>
                    <option key={"3"} value={"envelope"}>envelope</option>
                    <option key={"4"} value={"messageInABottle"}>messageInABottle</option>
                    <option key={"5"} value={"clueNoteIcon"}>clueNoteIcon</option>
                    <option key={"6"} value={"diary"}>diary</option>
                </SelectField>
                <IconClueDisplay hide="true" gameClueIcon={formCreateClueState.gameClueIcon || ''}/>
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueImage', event.target.value)}
                    name="gameClueImage"
                    placeholder="Game Clue Image"
                    label="Game Clue Image"
                    variation="quiet"
                    value={formCreateClueState.gameClueImage || ''}
                    required
                />
                <label>Game Clue Image</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreateClueState.gameClueImage || ''} />
                    {formCreateClueState.gameClueImage}</Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGameClueImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                    {(action == "add") &&
                    <Button id="createClue" className="show" onClick={addClue}
                            variation="primary">
                        Create Clue
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updateClue" className="show" onClick={updateClue}
                            variation="primary">
                        Update Clue
                    </Button>}
                </Flex>
            </Flex>
        </View>)
}