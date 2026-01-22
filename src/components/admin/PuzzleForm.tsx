import {Button, Flex, Input, SelectField, SwitchField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import {uploadData} from "aws-amplify/storage";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type GamePuzzle = Schema["GamePuzzle"]["type"];

interface PuzzleFormState {
    gameID: string;
    gamePlayZoneID: string;
    puzzleName: string;
    puzzleClueRevealed: string;
    puzzleClueText: string;
    winGame: boolean;
    order: number;
    disabled: boolean;
}

interface PuzzleFormProps {
    formCreateGameStateBackup: any;
}

export default function PuzzleForm(props: PuzzleFormProps) {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameCard must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    let action = modalContent.action;
    let puzzleID = modalContent.id;
    let zoneID = modalContent.zoneID;
    let gameID = modalContent.gameID;
    console.log("zoneID: " + zoneID);
    /* not sure why playzoneobject is here */
   /* let gamePlayZoneObject = props.gamePlayZoneObject;*/
    
    const initialStateCreatePuzzle: PuzzleFormState = {
        gameID: gameID,
        gamePlayZoneID: zoneID,
        puzzleName: '',
        puzzleClueRevealed: '',
        puzzleClueText: '',
        winGame: false,
        order: 1,
        disabled: false
    };
    
    const [formCreatePuzzleState, setFormCreatePuzzleState] = useState<PuzzleFormState>(initialStateCreatePuzzle);
    
    function setInputCreatePuzzle(key: keyof PuzzleFormState, value: string | number | boolean) {
        setFormCreatePuzzleState({ ...formCreatePuzzleState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populatePuzzleForm();
        } else if (action === "addBackupPuzzle") {
            /* not sure...
            setFormCreatePuzzleState({...puzzle, gameID: gameID, gamePlayZoneID: zoneID});
            */
        }
    },[]);
    
    async function populatePuzzleForm() {
        console.log("poplulate puzzle form");
        try {
            const client = dataService.getClient();
            const { data: puzzleFromAPI } = await client.models.GamePuzzle.get({ id: puzzleID });
            if (puzzleFromAPI) {
                setFormCreatePuzzleState(puzzleFromAPI);
            }
        } catch (err) {
            console.log('error fetching GamePuzzle', err);
        }
    }
    
    async function addPuzzleFromFile() {
        try {
            if (!formCreatePuzzleState.puzzleName) return;
            const client = dataService.getAuthClient();
            await client.models.GamePuzzle.create(formCreatePuzzleState);
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
        } catch (err) {
            console.log('error creating GamePuzzle:', err);
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
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.GamePuzzle.create(formCreatePuzzleState);
            
            if (result.errors) {
                console.error('Errors creating puzzle:', result.errors);
                window.alert("Error creating puzzle: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
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
            const client = dataService.getAuthClient();
            const result = await client.models.GamePuzzle.update(formCreatePuzzleState);
            
            if (result.errors) {
                console.error('Errors updating puzzle:', result.errors);
                window.alert("Error updating puzzle: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
            window.alert("Puzzle updated successfully!");
        } catch (err) {
            console.error('error updating GamePuzzle:', err);
            window.alert("Error updating puzzle: " + err);
        }
    }

    async function handleGamePuzzleClueImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e?.target?.files) {
            const file = e.target.files[0];
            const sizeInKB = Math.round(file.size / 1024);

            if (sizeInKB > 100) {
                alert("file is too big - it is " + sizeInKB + 'KB. Must be less than 100KB');
            } else {
                const gameDesignerCleaned = removeFunction(gameDesigner);
                try {
                    const result = await uploadData({
                        path: "public/" + gameDesignerCleaned + "/puzzles/" + file.name,
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
                } catch (error) {
                    console.log('Error : ', error);
                }
                setInputCreatePuzzle('puzzleClueRevealed', "https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/" + gameDesignerCleaned + "/puzzles/" + file.name);
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
                    label="disabled"
                    isChecked={formCreatePuzzleState.disabled}
                    onChange={(e) => setInputCreatePuzzle('disabled', e.target.checked)}
                />
                <SwitchField
                    label="winGame"
                    isChecked={formCreatePuzzleState.winGame}
                    onChange={(e) => setInputCreatePuzzle('winGame', e.target.checked)}
                />
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreatePuzzle('order', parseInt(event.target.value))}
                    value={formCreatePuzzleState.order.toString()}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleName', event.target.value)}
                    name="puzzleName"
                    placeholder="Puzzle Name"
                    label="Puzzle Name"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueText', event.target.value)}
                    name="puzzleClueText"
                    placeholder="Puzzle Clue Text (revealed)"
                    label="Clue Text Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueText}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueRevealed', event.target.value)}
                    name="puzzleClueRevealed"
                    placeholder="Puzzle Clue Revealed (image)"
                    label="Puzzle Image Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueRevealed}
                />
                <label>Puzzle Image Revealed</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreatePuzzleState.puzzleClueRevealed} />
                    {formCreatePuzzleState.puzzleClueRevealed}
                </Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGamePuzzleClueImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className="game-form">
                {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzle} variation="primary">
                        Create Puzzle
                    </Button>}
                {(action == "addBackupPuzzle") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzleFromFile} variation="primary">
                        Create Puzzle From File
                    </Button>}
                {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updatePuzzle} variation="primary">
                        Update Puzzle
                    </Button>}
            </Flex>
        </View>
    );
}