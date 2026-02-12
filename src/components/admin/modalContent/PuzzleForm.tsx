import {Button, Flex, Input, SwitchField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import {getUrl, uploadData} from "aws-amplify/storage";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import { getDefaultModalContent, createModalContent } from "../../../utils/modalHelpers";
type GamePuzzle = Schema["GamePuzzle"]["type"];

type PuzzleFormState = Omit<GamePuzzle, 'id' | 'createdAt' | 'updatedAt' | 'textField' | 'game'>;

export default function PuzzleForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameCard must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const action = modalContent.action;
    const puzzleID = modalContent.id;
    const zoneID = modalContent.zoneID;
    const gameID = modalContent.gameID;
    const gameDesigner = modalContent.gameDesigner;
    console.log("zoneID: " + zoneID);
    /* not sure why playzoneobject is here */
   /* let gamePlayZoneObject = props.gamePlayZoneObject;*/

    const initialStateCreatePuzzle: Partial<PuzzleFormState> = {
        gameID: gameID || '',
        gamePlayZoneID: zoneID || '',
        puzzleName: '',
        puzzleImage: '',
        puzzleClueText: '',
        order: 1,
        disabled: false
    };
    
    const [formCreatePuzzleState, setFormCreatePuzzleState] = useState<Partial<PuzzleFormState>>(initialStateCreatePuzzle);
    
    function setInputCreatePuzzle(key: keyof PuzzleFormState, value: string | number | boolean) {
        setFormCreatePuzzleState({ ...formCreatePuzzleState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populatePuzzleForm();
        }
    },[]);
    
    async function populatePuzzleForm() {
        console.log("poplulate puzzle form");
        try {
            const client = dataService.getClient();
            const { data: puzzleFromAPI } = await client.models.GamePuzzle.get({ id: puzzleID || '' });
            if (puzzleFromAPI) {
                setFormCreatePuzzleState(puzzleFromAPI);
            }
        } catch (err) {
            console.log('error fetching GamePuzzle', err);
        }
    }
    
    async function addPuzzle() {
        if (!formCreatePuzzleState.puzzleName) {
            window.alert("Puzzle Name is required");
            return;
        }
        if (!formCreatePuzzleState.gamePlayZoneID) {
            window.alert("Zone selection is required");
            return;
        }
        if (!formCreatePuzzleState.gameID) {
            window.alert("Game ID is required");
            return;
        }
        try {
            const puzzle = {
                gameID: formCreatePuzzleState.gameID,
                gamePlayZoneID: formCreatePuzzleState.gamePlayZoneID,
                puzzleName: formCreatePuzzleState.puzzleName,
                puzzleImage: formCreatePuzzleState.puzzleImage,
                puzzleClueText: formCreatePuzzleState.puzzleClueText,
                order: formCreatePuzzleState.order || 1,
                disabled: formCreatePuzzleState.disabled || false
            };
            const client = dataService.getAuthClient();
            const result = await client.models.GamePuzzle.create(puzzle);
            
            if (result.errors) {
                console.error('Errors creating puzzle:', result.errors);
                window.alert("Error creating puzzle: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            /* close modal */
            setModalContent(createModalContent({ updatedDB: true }));
            window.alert("Puzzle created successfully!");
        } catch (err) {
            console.error('error creating GamePuzzle:', err);
            window.alert("Error creating puzzle: " + err);
        }
    }
    
    async function updatePuzzle() {
        if (!formCreatePuzzleState.puzzleName) {
            window.alert("Puzzle Name is required");
            return;
        }
        try {
            const puzzle = { ...formCreatePuzzleState, id: puzzleID! };
            console.log("formCreateGameState - update game")
            for (const key in puzzle) {
                console.log(`${key}: ${puzzle[key as keyof typeof puzzle]}`);
            }
            const client = dataService.getAuthClient();
            const result = await client.models.GamePuzzle.update(puzzle);
            
            if (result.errors) {
                console.error('Errors updating puzzle:', result.errors);
                window.alert("Error updating puzzle: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            setModalContent(getDefaultModalContent());
            window.alert("Puzzle updated successfully!");
        } catch (err) {
            console.error('error updating GamePuzzle:', err);
            window.alert("Error updating puzzle: " + err);
        }
    }
    async function handlePuzzleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e?.target?.files) {
            const file = e.target.files[0];
            const sizeInKB = Math.round(file.size / 1024);

            if (sizeInKB > 100) {
                alert("file is too big - it is " + sizeInKB + 'KB. Must be less than 100KB');
            } else {
                const gameDesignerCleaned = removeFunction(gameDesigner || '');
                const filePath = "public/" + gameDesignerCleaned + "/puzzles/" + file.name;
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
                    setInputCreatePuzzle('puzzleImage', urlResult.url.toString());
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
        <View id="gamePuzzleForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Puzzle Form</strong></View>
            <View className="small">Game ID: {formCreatePuzzleState.gameID}</View>
            <View className="small">Zone ID: {formCreatePuzzleState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className="game-form">
                <SwitchField
                    label={formCreatePuzzleState.disabled? "disabled" : "live"}
                    isChecked={formCreatePuzzleState.disabled || false}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreatePuzzle('disabled', e.target.checked);
                    }}
                />
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreatePuzzle('order', parseInt(event.target.value))}
                    value={formCreatePuzzleState.order?.toString() || ''}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleName', event.target.value)}
                    name="puzzleName"
                    placeholder="Puzzle Name"
                    label="Puzzle Name"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleName || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueText', event.target.value)}
                    name="puzzleClueText"
                    placeholder="Puzzle Clue Text (revealed)"
                    label="Clue Text Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueText || ''}
                />
                <label>Puzzle Image Revealed</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreatePuzzleState.puzzleImage || ''} />
                    {formCreatePuzzleState.puzzleImage}
                </Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handlePuzzleImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className="game-form">
                {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzle} variation="primary">
                        Create Puzzle
                    </Button>}
                {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updatePuzzle} variation="primary">
                        Update Puzzle
                    </Button>}
            </Flex>
        </View>
    );
}