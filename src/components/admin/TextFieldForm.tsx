import {Button, Flex, Input, SwitchField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type TextField = Schema["TextField"]["type"];

interface TextFieldFormState {
    puzzleID: string;
    name: string;
    label: string;
    answer: string;
    order: number;
    disabled: boolean;
}

export default function TextFieldForm() {
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    let action = modalContent.action;
    let puzzleID = modalContent.puzzleID;
    let textField = modalContent.textField;
    let textFieldID = modalContent.id;

    const initialStateCreateTextField: TextFieldFormState = {
        puzzleID: puzzleID,
        name: '',
        label: '',
        answer: '',
        order: 1,
        disabled: false
    };
    
    const [formCreateTextFieldState, setFormCreateTextFieldState] = useState<TextFieldFormState>(initialStateCreateTextField);
    
    function setInputCreateTextField(key: keyof TextFieldFormState, value: string | number | boolean) {
        setFormCreateTextFieldState({ ...formCreateTextFieldState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateTextFieldForm();
        } else if (action === "addBackupTextField") {
            setFormCreateTextFieldState({...textField, puzzleID: puzzleID});
        }
    },[]);
    
    async function populateTextFieldForm() {
        try {
            const client = dataService.getClient();
            const { data: textFieldFromAPI } = await client.models.TextField.get({ id: textFieldID });
            if (textFieldFromAPI) {
                setFormCreateTextFieldState(textFieldFromAPI);
            }
        } catch (err) {
            console.log('error fetching TextField', err);
        }
    }
    
    async function addTextFieldFromFile() {
        try {
            if (!formCreateTextFieldState.puzzleID || !formCreateTextFieldState.name) return;
            const client = dataService.getAuthClient();
            await client.models.TextField.create(formCreateTextFieldState);
            setFormCreateTextFieldState(initialStateCreateTextField);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
        } catch (err) {
            console.log('error creating TextField:', err);
        }
    }
    
    async function addTextField() {
        if (!formCreateTextFieldState.name) {
            window.alert("Name is required");
            return;
        }
        if (!formCreateTextFieldState.label) {
            window.alert("Label is required");
            return;
        }
        if (!formCreateTextFieldState.answer) {
            window.alert("Answer is required");
            return;
        }
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.TextField.create(formCreateTextFieldState);
            
            if (result.errors) {
                console.error('Errors creating textfield:', result.errors);
                window.alert("Error creating textfield: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateTextFieldState(initialStateCreateTextField);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
            window.alert("TextField created successfully!");
        } catch (err) {
            console.error('error creating TextField:', err);
            window.alert("Error creating textfield: " + err);
        }
    }
    
    async function updateTextField() {
        if (!formCreateTextFieldState.name) {
            window.alert("Name is required");
            return;
        }
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.TextField.update(formCreateTextFieldState);
            
            if (result.errors) {
                console.error('Errors updating textfield:', result.errors);
                window.alert("Error updating textfield: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateTextFieldState(initialStateCreateTextField);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
            window.alert("TextField updated successfully!");
        } catch (err) {
            console.error('error updating TextField:', err);
            window.alert("Error updating textfield: " + err);
        }
    }

    return (
        <View id="gameTextFieldForm" className="show" as="form" margin=".5rem 0">
            <View><strong>TextField Form</strong></View>
            <View className="small">Puzzle ID: {formCreateTextFieldState.puzzleID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className="game-form">
                <SwitchField
                    label="disabled"
                    isChecked={formCreateTextFieldState.disabled}
                    onChange={(e) => setInputCreateTextField('disabled', e.target.checked)}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateTextField('order', parseInt(event.target.value))}
                    value={formCreateTextFieldState.order.toString()}
                />
                <TextField
                    onChange={(event) => setInputCreateTextField('puzzleID', event.target.value)}
                    name="puzzleID"
                    placeholder="Puzzle ID"
                    label="Puzzle ID"
                    variation="quiet"
                    value={formCreateTextFieldState.puzzleID}
                    required
                />
                <TextField
                    name="Name"
                    onChange={(event) => setInputCreateTextField('name', event.target.value)}
                    placeholder="Name"
                    label="Name"
                    variation="quiet"
                    value={formCreateTextFieldState.name}
                    required
                />
                <TextField
                    name="Label"
                    onChange={(event) => setInputCreateTextField('label', event.target.value)}
                    placeholder="Label"
                    label="Label"
                    variation="quiet"
                    value={formCreateTextFieldState.label}
                    required
                />
                <TextField
                    name="Answer"
                    onChange={(event) => setInputCreateTextField('answer', event.target.value)}
                    placeholder="Answer"
                    label='Answer &#123;"answer1":"baseball","answer2":"softball"&#125;'
                    variation="quiet"
                    value={formCreateTextFieldState.answer}
                    required
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className="game-form">
                {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addTextField} variation="primary">
                        Create TextField
                    </Button>}
                {(action == "addBackupTextField") &&
                    <Button id="createPuzzle" className="show" onClick={addTextFieldFromFile} variation="primary">
                        Create TextField From File
                    </Button>}
                {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updateTextField} variation="primary">
                        Update TextField
                    </Button>}
            </Flex>
        </View>
    );
}