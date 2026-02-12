import {Button, Flex, Input, SelectField, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../../MyContext.tsx";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {getDefaultModalContent} from "../../../utils/modalHelpers.ts";

type City = Schema["City"]["type"];
type Game = Schema["Game"]["type"];

type GameFormState = Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'gamePlayZone' | 'gameHint' | 'gameClue' | 'gamePuzzle' | 'gameScore'>;


export default function GameForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const [cities, setCities] = useState<City[]>([]);
    const action = modalContent.action;
    const gameID = modalContent.id;
    
    const initialStateCreateGame: Partial<GameFormState> = {
        gameName: '',
        gameType: '',
        gameLocationPlace: '',
        gameLocationCity: '',
        gameDesigner: '',
        gameLevel: '',
        walkingDistance: '',
        gameWinMessage: '',
        type: "game",
        gameDescription: '',
        gameLogisticInfo: '',
        gameSummary: '',
        gameIntro: '',
        gameGoals: '',
        disabled: false
    };
    
    const [formCreateGameState, setFormCreateGameState] = useState<Partial<GameFormState>>(initialStateCreateGame);
    
    useEffect(() => {
        if (action === "edit") {
            populateGameForm();
        }
        fetchCities();
    },[]);
    
    async function populateGameForm() {
        console.log("gameID : " + gameID );
        try {
            const client = dataService.getClient();
            const { data: gamesFromAPI } = await client.models.Game.get({ id: gameID || '' });
            if (gamesFromAPI) {
                setFormCreateGameState({
                    gameName: gamesFromAPI.gameName || '',
                    gameType: gamesFromAPI.gameType || '',
                    gameLocationPlace: gamesFromAPI.gameLocationPlace || '',
                    gameLocationCity: gamesFromAPI.gameLocationCity || '',
                    gameDesigner: gamesFromAPI.gameDesigner || '',
                    gameLevel: gamesFromAPI.gameLevel || '',
                    walkingDistance: gamesFromAPI.walkingDistance || '',
                    gameWinMessage: gamesFromAPI.gameWinMessage || '',
                    type: gamesFromAPI.type || 'game',
                    gameDescription: gamesFromAPI.gameDescription || '',
                    gameLogisticInfo: gamesFromAPI.gameLogisticInfo || '',
                    gameSummary: gamesFromAPI.gameSummary || '',
                    gameIntro: gamesFromAPI.gameIntro || '',
                    gameGoals: gamesFromAPI.gameGoals || '',
                    disabled: gamesFromAPI.disabled || false,
                    latitude: gamesFromAPI.latitude || undefined,
                    longitude: gamesFromAPI.longitude || undefined,
                    order: gamesFromAPI.order || undefined
                });
            }
        } catch (err) {
            console.log('error fetching getGame', err);
        }
    }
    
    async function addGame() {
        console.log("addGame from form: " + formCreateGameState.gameName);
        if (!formCreateGameState.gameName) {
            window.alert("Game Name is required");
            return;
        }
        if (!formCreateGameState.gameLocationCity) {
            window.alert("Game Location City is required");
            return;
        }
        if (!formCreateGameState.gameLocationPlace) {
            window.alert("Game Location Place is required");
            return;
        }
        try {
            const game = { 
                ...formCreateGameState,
                gameName: formCreateGameState.gameName!,
                gameLocationCity: formCreateGameState.gameLocationCity!,
                gameLocationPlace: formCreateGameState.gameLocationPlace!,
                type: formCreateGameState.type || 'game',
                order: formCreateGameState.order || 0
            };
            console.log("addGame data:", JSON.stringify(game));
            const client = dataService.getAuthClient();
            const result = await client.models.Game.create(game);
            console.log("Game create result:", result);
            console.log("Result data:", result.data);
            console.log("Result errors:", result.errors);
            
            if (result.errors) {
                console.error('Errors creating game:', result.errors);
                window.alert("Error creating game: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateGameState(initialStateCreateGame);
            /* close Modal */
            setModalContent(getDefaultModalContent());
            window.alert("Game created successfully!");
        } catch (err) {
            console.error('error creating games:', err);
            window.alert("Error creating game: " + err);
        }
    }
    
    async function addGameFromFile() {
        try {
            if (!formCreateGameState.gameName) return;
            if (!formCreateGameState.gameLocationCity) return;
            if (!formCreateGameState.gameLocationPlace) return;
            const game = {
                ...formCreateGameState,
                gameName: formCreateGameState.gameName!,
                gameLocationCity: formCreateGameState.gameLocationCity!,
                gameLocationPlace: formCreateGameState.gameLocationPlace!,
                type: formCreateGameState.type || 'game',
                order: formCreateGameState.order || 0
            };
            console.log("addGame: " + game);
            setFormCreateGameState(initialStateCreateGame);
            const client = dataService.getClient();
            await client.models.Game.create(game);
            /* close Modal */
            setModalContent(getDefaultModalContent());
        } catch (err) {
            console.log('error creating games:', err);
        }
    }
    
    async function updateGame() {
        console.log("updateGame: " + formCreateGameState.gameName)
        try {
            if (!formCreateGameState.gameName) return;
            const game = { ...formCreateGameState, id: gameID! };
            console.log("formCreateGameState - update game")
            for (const key in game) {
                console.log(`${key}: ${game[key as keyof typeof game]}`);
            }
            const client = dataService.getAuthClient();
            const result = await client.models.Game.update(game);
            console.log("Game update result:", result);
            console.log("Result errors:", result.errors);
            
            if (result.errors) {
                console.error('Errors updating game:', result.errors);
                window.alert("Error updating game: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateGameState(initialStateCreateGame);
            /* close Modal */
            setModalContent(getDefaultModalContent());
            window.alert("Game updated successfully!");
        } catch (err) {
            console.error('error updating games:', err);
            window.alert("Error updating game: " + err);
        }
    }
    
    function setInputCreateGame(key: keyof GameFormState, value: string | number | boolean | null) {
        setFormCreateGameState({ ...formCreateGameState, [key]: value });
    }
    function handleUploadBackup() {

    }
   /* const [files, setFiles] = useState("");
    
    async function handleUploadBackup(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("uploaded file: " + e.target.files?.[0]?.name);
        if (e?.target?.files) {
            const file = e.target.files[0];
            var fileSize = file.size;
            var sizeInKB = Math.round(fileSize / 1024);
            var sizeInMB = Math.round(fileSize / (1024 * 1024));

            console.log('File Size: ' + fileSize + ' bytes');
            console.log('File Size: ' + sizeInKB + ' KB');
            console.log('File Size: ' + sizeInMB + ' MB');
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                if (e.target?.result) {
                    console.log("e.target.result", e.target.result);
                    const result = e.target.result as string;
                    setFormCreateGameState(JSON.parse(result));
                    localStorage.setItem("backup", result);
                }
            };
        }
    }*/
    
    async function fetchCities() {
        try {
            const client = dataService.getClient();
            const { data: citiesFromAPI } = await client.models.City.list();
            setCities(citiesFromAPI);
        } catch (err) {
            console.log('error fetching cities', err);
        }
    }
    
    return (
        <View id="gameForm" className="show" as="form" margin=".5rem 0">
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                {(action == "addFromFile") && <View>
                <label htmlFor="file-upload-txt" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload-txt" type="file" accept=".txt" onChange={handleUploadBackup} />
                </View>}
                {(action == "edit") && <View>
                    game id: {gameID}
                </View>}
                <SwitchField
                    label={formCreateGameState.disabled? "disabled" : "live"}
                    isChecked={formCreateGameState.disabled || false}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateGame('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    placeholder="order"
                    onChange={(event) =>  setInputCreateGame('order', parseInt(event.target.value))}
                    value={formCreateGameState.order?.toString() || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameName', event.target.value)}
                    name="gameName"
                    placeholder="Game Name"
                    label="Game Name"
                    variation="quiet"
                    value={formCreateGameState.gameName || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameType', event.target.value)}
                    name="GameType"
                    placeholder="free/not free"
                    label="Game Type"
                    variation="quiet"
                    value={formCreateGameState.gameType || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameLocationPlace', event.target.value)}
                    name="GameLocationPlace"
                    placeholder="Place"
                    label="Game Location Place"
                    variation="quiet"
                    value={formCreateGameState.gameLocationPlace || ''}
                    required
                />
                <SelectField
                    className={"city-dropdown"}
                    label="Game Location City"
                    placeholder="choose a city"
                    value={formCreateGameState.gameLocationCity || ''}
                    onChange={(event) => setInputCreateGame('gameLocationCity', event.target.value)}>
                    {cities.map((city) => (
                        <option key={city.id} value={city.cityName || ''}>{city.cityName}</option>
                    ))}
                </SelectField>
                <TextField
                    onChange={(event) => setInputCreateGame('latitude', event.target.value)}
                    name="latitude"
                    placeholder="latitude"
                    label="latitude"
                    variation="quiet"
                    value={formCreateGameState.latitude || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('longitude', event.target.value)}
                    name="longitude"
                    placeholder="longitude"
                    label="longitude"
                    variation="quiet"
                    value={formCreateGameState.longitude || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameWinMessage', event.target.value)}
                    name="GameWinMessage"
                    placeholder="game win message"
                    label="Game Win Message"
                    variation="quiet"
                    value={formCreateGameState.gameWinMessage || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameDescription', event.target.value)}
                    name="GameDescription"
                    placeholder="Game Description (on Game Card)"
                    label="Game Description (on Game Card)"
                    variation="quiet"
                    value={formCreateGameState.gameDescription || ''}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameGoals', event.target.value)}
                    name="GameGoals"
                    placeholder="Game Goals (on Game Card)"
                    label="Game Goals (on Game Card)"
                    variation="quiet"
                    value={formCreateGameState.gameGoals || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameLevel', event.target.value)}
                    name="Game Level"
                    placeholder="Game Level"
                    label="Game Level"
                    variation="quiet"
                    value={formCreateGameState.gameLevel || ''}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('walkingDistance', event.target.value)}
                    name="GameGoals"
                    placeholder="Walking Distance"
                    label="Walking Distance"
                    variation="quiet"
                    value={formCreateGameState.walkingDistance || ''}
                />
                <TextAreaField
                    autoComplete="off"
                    label="Game Summary (on Game Detail)"
                    direction="column"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="GameSummary"
                    placeholder="Game Summary"
                    rows={3}
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameSummary || ''}
                    onChange={(e) => setInputCreateGame('gameSummary', e.currentTarget.value)}
                />
                <TextAreaField
                    autoComplete="off"
                    direction="column"
                    label="Game Logistics Info (on Game Detail)"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="Game Logistics Info"
                    placeholder="Game Logistics Info"
                    rows={3}
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameLogisticInfo || ''}
                    onChange={(e) => setInputCreateGame('gameLogisticInfo', e.currentTarget.value)}
                />
                <TextAreaField
                    autoComplete="off"
                    direction="column"
                    label="Game Intro (on Game Intro)"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="Game Intro"
                    placeholder="Game Intro"
                    rows={3}
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameIntro || ''}
                    onChange={(e) => setInputCreateGame('gameIntro', e.currentTarget.value)}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameDesigner', event.target.value)}
                    name="GameGoals"
                    placeholder="Game Designer"
                    label="Game Designer"
                    variation="quiet"
                    value={formCreateGameState.gameDesigner || ''}
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                {(action == "add") &&
                <Button id="createGame" className="show" onClick={addGame}
                        variation="primary">
                    Create Game
                </Button>}
                {(action == "addFromFile") &&
                <Button id="createGame" className="show" onClick={addGameFromFile}
                        variation="primary">
                    Add Game From File
                </Button>}
                {(action == "edit") &&
                <Button id="updateGame" className="show" onClick={updateGame}
                        variation="primary">
                    Update Game
                </Button>}
            </Flex>
        </View>)
}