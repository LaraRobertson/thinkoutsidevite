import {
    Button,
    Flex,
    Input,
    SwitchField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import { uploadData } from 'aws-amplify/storage';
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type GamePlayZone = Schema["GamePlayZone"]["type"];

interface ZoneFormState {
    gameID: string;
    gameZoneName: string;
    gameZoneImage: string;
    gameZoneDescription: string;
    longitude: string;
    latitude: string;
    order: number;
    disabled: boolean;
}

export default function ZoneForm() {
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    let action = modalContent.action;
    let zoneID = modalContent.id;
    let gameID = modalContent.gameID;
    let zone = modalContent.zone;
    let gameDesigner = modalContent.gameDesigner;

    const initialStateCreateZone: ZoneFormState = {
        gameID: gameID,
        gameZoneName: '',
        gameZoneImage: '',
        gameZoneDescription: '',
        longitude: '',
        latitude: '',
        order: 1,
        disabled: false
    };
    
    const [formCreateZoneState, setFormCreateZoneState] = useState<ZoneFormState>(initialStateCreateZone);
    
    function setInputCreateZone(key: keyof ZoneFormState, value: string | number | boolean) {
        setFormCreateZoneState({ ...formCreateZoneState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateZoneForm();
        } else if (action === "addBackupZone") {
            setFormCreateZoneState({...zone, gameID: gameID});
        }
    },[]);
    
    async function populateZoneForm() {
        try {
            const client = dataService.getClient();
            const { data: zoneFromAPI } = await client.models.GamePlayZone.get({ id: zoneID });
            if (zoneFromAPI) {
                setFormCreateZoneState(zoneFromAPI);
            }
        } catch (err) {
            console.log('error fetching GamePlayZone', err);
        }
    }
    
    async function addZoneFromFile() {
        try {
            if (!formCreateZoneState.gameZoneName) return;
            const client = dataService.getAuthClient();
            await client.models.GamePlayZone.create(formCreateZoneState);
            setFormCreateZoneState(initialStateCreateZone);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
        } catch (err) {
            console.log('error creating GamePlayZone:', err);
        }
    }
    
    async function addZone() {
        if (!formCreateZoneState.gameZoneName) {
            window.alert("Zone Name is required");
            return;
        }
        /*if (!formCreateZoneState.latitude) {
            window.alert("Latitude is required");
            return;
        }
        if (!formCreateZoneState.longitude) {
            window.alert("Longitude is required");
            return;
        }*/
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.GamePlayZone.create(formCreateZoneState);
            
            if (result.errors) {
                console.error('Errors creating zone:', result.errors);
                window.alert("Error creating zone: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateZoneState(initialStateCreateZone);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
            window.alert("Zone created successfully!");
        } catch (err) {
            console.error('error creating GamePlayZone:', err);
            window.alert("Error creating zone: " + err);
        }
    }
    
    async function updateZone() {
        if (!formCreateZoneState.gameZoneName) {
            window.alert("Zone Name is required");
            return;
        }
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.GamePlayZone.update(formCreateZoneState);
            
            if (result.errors) {
                console.error('Errors updating zone:', result.errors);
                window.alert("Error updating zone: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateZoneState(initialStateCreateZone);
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB: true
            });
            window.alert("Zone updated successfully!");
        } catch (err) {
            console.error('error updating GamePlayZone:', err);
            window.alert("Error updating zone: " + err);
        }
    }

    async function handleGameZoneImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e?.target?.files) {
            const file = e.target.files[0];
            const sizeInKB = Math.round(file.size / 1024);

            if (sizeInKB > 100) {
                alert("file is too big - it is " + sizeInKB + 'KB. Must be less than 100KB');
            } else {
                const gameDesignerCleaned = removeFunction(gameDesigner);
                try {
                    const result = await uploadData({
                        path: "public/" + gameDesignerCleaned + "/zones/" + file.name,
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
                setInputCreateZone('gameZoneImage', "https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/" + gameDesignerCleaned + "/zones/" + file.name);
            }
        }
    }
    
    function removeFunction(inputString: string): string {
        return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    return (
        <View id="gamePlayZoneForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Play Zone Form</strong></View>
            <View className="small">Game ID: {formCreateZoneState.gameID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className="game-form">
                <SwitchField
                    label="disabled"
                    isChecked={formCreateZoneState.disabled}
                    onChange={(e) => setInputCreateZone('disabled', e.target.checked)}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateZone('order', parseInt(event.target.value))}
                    value={formCreateZoneState.order.toString()}
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneName', event.target.value)}
                    name="gameZoneName"
                    placeholder="Game Zone Name"
                    label="Game Zone Name"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneDescription', event.target.value)}
                    name="gameZoneDescription"
                    placeholder="Game Zone Description"
                    label="Game Zone Description"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneDescription}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('latitude', event.target.value)}
                    name="latitude"
                    placeholder="latitude"
                    label="latitude"
                    variation="quiet"
                    value={formCreateZoneState.latitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('longitude', event.target.value)}
                    name="longitude"
                    placeholder="longitude"
                    label="longitude"
                    variation="quiet"
                    value={formCreateZoneState.longitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneImage', event.target.value)}
                    name="Zone Image"
                    placeholder="Zone Image"
                    label="Zone Image (350px x 300px & <100kb)"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneImage}
                    required
                />
                <label>Zone Image</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreateZoneState.gameZoneImage} />
                    {formCreateZoneState.gameZoneImage}
                </Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGameZoneImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className="game-form">
                {(action == "add") &&
                    <Button id="createZone" onClick={addZone} variation="primary">
                        Create Zone
                    </Button>}
                {(action == "addBackupZone") &&
                    <Button id="createZone" onClick={addZoneFromFile} variation="primary">
                        Create Zone from File
                    </Button>}
                {(action == "edit") &&
                    <Button id="updateZone" onClick={updateZone} variation="primary">
                        Update Zone
                    </Button>}
            </Flex>
        </View>
    );
}