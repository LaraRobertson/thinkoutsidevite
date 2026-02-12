import {Button, Flex, Input, SelectField, SwitchField, TextField, View} from "@aws-amplify/ui-react";
import {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {getDefaultModalContent, createModalContent} from "../../../utils/modalHelpers.ts";

type GameHint = Schema["GameHint"]["type"];
type HintFormState = Omit<GameHint, 'id' | 'createdAt' | 'updatedAt' | 'game'>;

export default function HintForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("HintForm must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const action = modalContent.action;
    const hintID = modalContent.id;
    const zoneID = modalContent.zoneID;
    const gameID = modalContent.gameID;

    const initialStateCreateHint: HintFormState = {
        gameID: gameID || '',
        gamePlayZoneID: zoneID,
        gameHintName: '',
        gameHintDescription: '',
        gameHintType: '',
        order: 1,
        disabled: false
    };
    
    const [formCreateHintState, setFormCreateHintState] = useState<HintFormState>(initialStateCreateHint);
    
    function setInputCreateHint(key: keyof HintFormState, value: string | number | boolean) {
        setFormCreateHintState({ ...formCreateHintState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateHintForm();
        }
    },[]);
    
    async function populateHintForm() {
        try {
            const client = dataService.getClient();
            const { data: hintFromAPI } = await client.models.GameHint.get({ id: hintID || '' });
            if (hintFromAPI) {
                setFormCreateHintState(hintFromAPI);
            }
        } catch (err) {
            console.log('error fetching GameHint', err);
        }
    }
    
    async function addHintFromFile() {
        try {
            if (!formCreateHintState.gameID || !formCreateHintState.gameHintName) return;
            const client = dataService.getAuthClient();
            await client.models.GameHint.create(formCreateHintState);
            setFormCreateHintState(initialStateCreateHint);
            setModalContent(createModalContent({ updatedDB: true }));
        } catch (err) {
            console.log('error creating GameHint:', err);
        }
    }
    
    async function addHint() {
        if (!formCreateHintState.gameHintName) {
            window.alert("Hint Name is required");
            return;
        }
        if (!formCreateHintState.gameHintDescription) {
            window.alert("Hint Description is required");
            return;
        }
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.GameHint.create(formCreateHintState);
            
            if (result.errors) {
                console.error('Errors creating hint:', result.errors);
                window.alert("Error creating hint: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateHintState(initialStateCreateHint);
            setModalContent(createModalContent({ updatedDB: true }));
            window.alert("Hint created successfully!");
        } catch (err) {
            console.error('error creating GameHint:', err);
            window.alert("Error creating hint: " + err);
        }
    }
    
    async function updateHint() {
        if (!formCreateHintState.gameHintName) {
            window.alert("Hint Name is required");
            return;
        }
        try {
            const gameHint = { ...formCreateHintState, id: hintID! };
            const client = dataService.getAuthClient();
            const result = await client.models.GameHint.update(gameHint);
            
            if (result.errors) {
                console.error('Errors updating hint:', result.errors);
                window.alert("Error updating hint: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateHintState(initialStateCreateHint);
            /* close modal */
            setModalContent(getDefaultModalContent());
            window.alert("Hint updated successfully!");
        } catch (err) {
            console.error('error updating GameHint:', err);
            window.alert("Error updating hint: " + err);
        }
    }

    return (
        <View id="gameHintForm" className="show" as="form" margin=".5rem">
            <View><strong>Game Hint Form</strong></View>
            <View className="small">Game ID: {formCreateHintState.gameID}</View>
            <View className="small">Zone ID: {formCreateHintState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className="game-form">
                <SwitchField
                    label={formCreateHintState.disabled? "disabled" : "live"}
                    isChecked={formCreateHintState.disabled || false}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateHint('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    placeholder="order"
                    onChange={(event) => setInputCreateHint('order', parseInt(event.target.value))}
                    value={formCreateHintState.order.toString()}
                />
                <TextField
                    onChange={(event) => setInputCreateHint('gameHintName', event.target.value)}
                    name="gameHintName"
                    placeholder="Game Hint Name"
                    label="Game Hint Name"
                    variation="quiet"
                    value={formCreateHintState.gameHintName || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateHint('gameHintDescription', event.target.value)}
                    name="GameHintDescription"
                    placeholder="Game Hint Description"
                    label="Game Hint Description"
                    variation="quiet"
                    value={formCreateHintState.gameHintDescription || ''}
                    required
                />
                <SelectField
                    className={"city-dropdown"}
                    label="Game Hint Type"
                    placeholder="choose a type"
                    value={formCreateHintState.gameHintType || ''}
                    onChange={(event) => setInputCreateHint('gameHintType', event.target.value)}>
                        <option value="5">5 Minutes</option>
                        <option value="free">free</option>
                </SelectField>
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px">
                {(action == "add") &&
                    <Button id="createHint" className="show" onClick={addHint} variation="primary">
                        Create Hint
                    </Button>}
                {(action == "addBackupHint") &&
                    <Button id="createHint" className="show" onClick={addHintFromFile} variation="primary">
                        Create Hint From File
                    </Button>}
                {(action == "edit") &&
                    <Button id="updateHint" className="show" onClick={updateHint} variation="primary">
                        Update Hint
                    </Button>}
            </Flex>
        </View>
    );
}