import {Button, Flex, Input, SwitchField, TextField, View} from "@aws-amplify/ui-react";
import {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {getDefaultModalContent, createModalContent} from "../../../utils/modalHelpers.ts";

type TextField = Schema["TextField"]["type"];
type TextFieldFormState = Omit<TextField, 'id' | 'createdAt' | 'updatedAt' | 'puzzle' >;

export default function TextFieldForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("TextFieldForm must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const action = modalContent.action;
    const puzzleID = modalContent.puzzleID;
    const textFieldID = modalContent.id;

    const initialStateCreateTextField:  Partial<TextFieldFormState> = {
        puzzleID: puzzleID || '',
        name: '',
        label: '',
        answer: '',
        order: 1,
        disabled: false
    };
    
    const [formCreateTextFieldState, setFormCreateTextFieldState] = useState<Partial<TextFieldFormState>>(initialStateCreateTextField);
    
    function setInputCreateTextField(key: keyof TextFieldFormState, value: string | number | boolean) {
        setFormCreateTextFieldState({ ...formCreateTextFieldState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateTextFieldForm();
        }
    },[]);
    
    async function populateTextFieldForm() {
        try {
            const client = dataService.getClient();
            const { data: textFieldFromAPI } = await client.models.TextField.get({ id: textFieldID || '' });
            if (textFieldFromAPI) {
                setFormCreateTextFieldState(textFieldFromAPI);
            }
        } catch (err) {
            console.log('error fetching TextField', err);
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
            const textField = {
                ...formCreateTextFieldState,
                name: formCreateTextFieldState.name!,
                puzzleID: formCreateTextFieldState.puzzleID!,
                order: formCreateTextFieldState.order || 0
            };
            const client = dataService.getAuthClient();
            const result = await client.models.TextField.create(textField);
            
            if (result.errors) {
                console.error('Errors creating textfield:', result.errors);
                window.alert("Error creating textfield: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateTextFieldState(initialStateCreateTextField);
            /* close Modal */
            setModalContent(createModalContent({ updatedDB: true }));
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
            const textField = { ...formCreateTextFieldState, id: textFieldID! };
            console.log("formCreateTextFieldState - update textField")
            for (const key in textField) {
                console.log(`${key}: ${textField[key as keyof typeof textField]}`);
            }
            const client = dataService.getAuthClient();
            const result = await client.models.TextField.update(textField);
            
            if (result.errors) {
                console.error('Errors updating textfield:', result.errors);
                window.alert("Error updating textfield: " + JSON.stringify(result.errors));
                return;
            }
            setFormCreateTextFieldState(initialStateCreateTextField);
            /* close Modal */
            setModalContent(getDefaultModalContent());
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
                    label={formCreateTextFieldState.disabled? "disabled" : "live"}
                    isChecked={formCreateTextFieldState.disabled || false}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateTextField('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateTextField('order', parseInt(event.target.value))}
                    value={formCreateTextFieldState.order?.toString() || ''}
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
                    value={formCreateTextFieldState.name || ''}
                    required
                />
                <TextField
                    name="Label"
                    onChange={(event) => setInputCreateTextField('label', event.target.value)}
                    placeholder="Label"
                    label="Label"
                    variation="quiet"
                    value={formCreateTextFieldState.label || ''}
                    required
                />
                <TextField
                    name="Answer"
                    onChange={(event) => setInputCreateTextField('answer', event.target.value)}
                    placeholder="Answer"
                    label='Answer &#123;"answer1":"baseball","answer2":"softball"&#125;'
                    variation="quiet"
                    value={formCreateTextFieldState.answer || ''}
                    required
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className="game-form">
                {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addTextField} variation="primary">
                        Create TextField
                    </Button>}
                {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updateTextField} variation="primary">
                        Update TextField
                    </Button>}
            </Flex>
        </View>
    );
}