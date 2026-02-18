import {
    Button,
    Flex,
    Input,
    SwitchField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import { uploadData, getUrl } from 'aws-amplify/storage';
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {getDefaultModalContent, updateSingleGame} from "../../../utils/modalHelpers.ts";

type GamePlayZone = Schema["GamePlayZone"]["type"];

type ZoneFormState = Omit<GamePlayZone, 'id' | 'createdAt' | 'updatedAt' | 'game' >;

export default function ZoneForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const action = modalContent.action;
    const zoneID = modalContent.id;
    const gameID = modalContent.gameID;
    const gameDesigner = modalContent.gameDesigner;

    const initialStateCreateZone: Partial<ZoneFormState> = {
        gameID: gameID || '',
        gameZoneName: '',
        gameZoneImage: '',
        gameZoneDescription: '',
        longitude: '',
        latitude: '',
        gameZoneIcon: '',
        order: 1,
        disabled: false
    };

    const [formCreateZoneState, setFormCreateZoneState] = useState<Partial<ZoneFormState>>(initialStateCreateZone);
    
    function setInputCreateZone(key: keyof ZoneFormState, value: string | number | boolean) {
        setFormCreateZoneState({ ...formCreateZoneState, [key]: value });
    }
    
    useEffect(() => {
        if (action === "edit") {
            populateZoneForm();
        }
    },[]);
    
    async function populateZoneForm() {
        try {
            const client = dataService.getClient();
            const { data: zoneFromAPI } = await client.models.GamePlayZone.get({ id: zoneID || '' });
            if (zoneFromAPI) {
                setFormCreateZoneState({
                    gameID: zoneFromAPI.gameID || '',
                    gameZoneName: zoneFromAPI.gameZoneName || '',
                    gameZoneImage: zoneFromAPI.gameZoneImage || '',
                    gameZoneDescription: zoneFromAPI.gameZoneDescription || '',
                    longitude: zoneFromAPI.longitude || '',
                    latitude: zoneFromAPI.latitude || '',
                    gameZoneIcon: zoneFromAPI.gameZoneIcon || '',
                    order: zoneFromAPI.order || 1,
                    disabled: zoneFromAPI.disabled || false
                });
            }
        } catch (err) {
            console.log('error fetching GamePlayZone', err);
        }
    }
    
    async function addZoneFromFile() {
        try {
            if (!formCreateZoneState.gameZoneName) return;
            const zone = {
                ...formCreateZoneState,
                gameZoneName: formCreateZoneState.gameZoneName!,
                gameID: formCreateZoneState.gameID!,
                order: formCreateZoneState.order || 0
            };
            const client = dataService.getAuthClient();
            await client.models.GamePlayZone.create(zone);
            setFormCreateZoneState(initialStateCreateZone);
            /* close Modal */
            setModalContent(getDefaultModalContent());
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
            const zone = {
                ...formCreateZoneState,
                gameZoneName: formCreateZoneState.gameZoneName!,
                gameID: formCreateZoneState.gameID!,
                order: formCreateZoneState.order || 0
            };
            const client = dataService.getAuthClient();
            const result = await client.models.GamePlayZone.create(zone);
            
            if (result.errors) {
                console.error('Errors creating zone:', result.errors);
                window.alert("Error creating zone: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateZoneState(initialStateCreateZone);
            /* close Modal/update single game */
            setModalContent(updateSingleGame());
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
            const zone = { ...formCreateZoneState, id: zoneID! };
            console.log("formCreateZoneState - update zone")
            for (const key in zone) {
                console.log(`${key}: ${zone[key as keyof typeof zone]}`);
            }
            const client = dataService.getAuthClient();
            const result = await client.models.GamePlayZone.update(zone);
            
            if (result.errors) {
                console.error('Errors updating zone:', result.errors);
                window.alert("Error updating zone: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateZoneState(initialStateCreateZone);
            /* close Modal/update single game */
            setModalContent(updateSingleGame());
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
                const gameDesignerCleaned = removeFunction(gameDesigner || '');
                const filePath = "public/" + gameDesignerCleaned + "/zones/" + file.name;
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
                    setInputCreateZone('gameZoneImage', urlResult.url.toString());
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
        <View id="gamePlayZoneForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Play Zone Form</strong></View>
            <View className="small">Game ID: {formCreateZoneState.gameID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className="game-form">
                <SwitchField
                    label="disabled"
                    isDisabled={formCreateZoneState.disabled || false}
                    onChange={(e) => setInputCreateZone('disabled', e.target.checked)}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateZone('order', parseInt(event.target.value))}
                    value={formCreateZoneState.order?.toString() || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneName', event.target.value)}
                    name="gameZoneName"
                    placeholder="Game Zone Name"
                    label="Game Zone Name"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneName || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneDescription', event.target.value)}
                    name="gameZoneDescription"
                    placeholder="Game Zone Description"
                    label="Game Zone Description"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneDescription || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('latitude', event.target.value)}
                    name="latitude"
                    placeholder="latitude"
                    label="latitude"
                    variation="quiet"
                    value={formCreateZoneState.latitude || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('longitude', event.target.value)}
                    name="longitude"
                    placeholder="longitude"
                    label="longitude"
                    variation="quiet"
                    value={formCreateZoneState.longitude || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneImage', event.target.value)}
                    name="Zone Image"
                    placeholder="Zone Image"
                    label="Zone Image (350px x 300px & <100kb)"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneImage || ''}
                    required
                />
                <label>Zone Image (by {gameDesigner})</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreateZoneState.gameZoneImage || ''} />
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