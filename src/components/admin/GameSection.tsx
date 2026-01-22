import {Button, Flex, Heading, View, Image,
    Table, TableCell, TableBody, TableHead, TableRow, SelectField} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import copyGame from "./copyGame";
import {GreenIcon, IconClueDisplay} from "../sharedComponents";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type Game = Schema["Game"]["type"];
type City = Schema["City"]["type"];

export default function GameSection() {
    const [formCreateGameStateBackup, setFormCreateGameStateBackup] = useState({"gameName":"New"});
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const [cityValue, setCityValue] = React.useState("");
    const [games, setGames] = useState<Game[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [gameType, setGameType] = useState("all");
    const [gameVisible, setGameVisible] = useState("");
    const [gameDesigner, setGameDesigner] = useState("");
    const [gameIndex, setGameIndex] = useState<number>(0);
    const [gamePlayZoneObject, setGamePlayZoneObject] = useState({});
    const [gamePlayZoneObjectBackup, setGamePlayZoneObjectBackup] = useState({});
    const [zoneBackup, setZoneBackup] = useState(false);
    const [puzzleBackup, setPuzzleBackup] = useState(false);
    const [clueBackup, setClueBackup] = useState(false);
    const [hintBackup, setHintBackup] = useState(false);
    const [gameNameBackupArray, setGameNameBackupArray] = useState([]);

    const [disabledGame, setDisabledGame] = useState<boolean | string | undefined>();
    const [gamesFilter, setGamesFilter] = useState<Record<string, any>>({type: {eq:"game"}});
    
    function setFilterCreateGame(key?: string, value?: {eq: string | boolean}) {
        console.log("setFilterCreateGame: " + key);
        if (key) {
            setGamesFilter({...gamesFilter, [key]: value})
        } else {
            setGamesFilter({
                type: {eq:"game"}
            });
            setDisabledGame("");
            setGameType("game");
        }
    }
    
    async function fetchGames() {
        console.log("fetchGames called - gamesFilter:", JSON.stringify(gamesFilter));
        for (const key in gamesFilter) {
            const filterValue = gamesFilter[key];
            console.log(`${key}: ${JSON.stringify(filterValue)}`);
            if (typeof filterValue === 'object' && filterValue !== null && 'eq' in filterValue) {
                const nestedValue = filterValue.eq;
                console.log(`eq: ${nestedValue}`);
                if (key === "gameType") {
                    setGameType(nestedValue as string);
                }
                if (key === "disabled") {
                    setDisabledGame(nestedValue as boolean);
                }
            }
        }
        try {
            const client = dataService.getClient();
            const { data: gamesFromAPI } = await client.models.Game.list({
                filter: gamesFilter as any,
                selectionSet: ['id', 'gameName', 'gameDescription', 'gameLogisticInfo', 'gameSummary', 'gameLocationPlace', 'latitude', 'longitude', 'gameLocationPlaceDetails', 'gameLocationCity', 'gameDesigner', 'gameLevel', 'walkingDistance', 'playZones', 'gameImage', 'gameType', 'gameWinMessage', 'gameWinImage', 'gameGoals', 'gameIntro', 'gameMap', 'type', 'order', 'disabled', 'userID', 'createdAt', 'updatedAt', 'gamePlayZone.*', 'gameHint.*', 'gameClue.*', 'gamePuzzle.*', 'gamePuzzle.textField.*']
            });
            console.log("Games with filter and related data:", gamesFromAPI?.length, "games");
            console.log("Filtered games data:", gamesFromAPI);
            setGames(gamesFromAPI);
        } catch (err) {
            console.error('error fetching games:', err);
        }
    }
    
    async function deleteGame(props: {gameID: string}) {
        console.log("props.gameID: " + props.gameID);
        try {
            const client = dataService.getAuthClient();
            await client.models.Game.delete({ id: props.gameID });
            setGameVisible("");
            setGameDesigner("");
            setGameIndex(0);
            fetchGames();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }
    
    async function deleteZone(props: {zoneID: string; gameZoneName: string}) {
        console.log("props.zoneID: " + props.zoneID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GamePlayZone.delete({ id: props.zoneID });
            console.log("delete gameZoneName: " + props.gameZoneName);
            deleteGameNameBackup(props.gameZoneName);
        } catch (err) {
            console.log('error deleting zone:', err);
        }
        fetchGames();
    }

    function deleteGameNameBackup(value: string) {
        console.log("gameNamBackupArray (before): " + JSON.stringify(gameNameBackupArray));
        setGameNameBackupArray(oldValues => {
            return oldValues.filter(name => name !== value)
        })
    }
    
    function addGameNameBackup(value: string) {
        console.log("gameNamBackupArray (before): " + JSON.stringify(gameNameBackupArray));
        setGameNameBackupArray([...gameNameBackupArray,value]);
    }
    
    async function deleteHint(props: {hintID: string; hintName: string}) {
        console.log("props.hintID: " + props.hintID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameHint.delete({ id: props.hintID });
            console.log("delete textFieldName: " + props.hintName);
            deleteGameNameBackup(props.hintName);
        } catch (err) {
            console.log('error deleting hint:', err);
        }
        fetchGames();
    }

    async function deleteClue(props: {clueID: string; gameClueName: string}) {
        console.log("props.clueID: " + props.clueID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameClue.delete({ id: props.clueID });
            console.log("delete clueName: " + props.gameClueName);
            deleteGameNameBackup(props.gameClueName);
        } catch (err) {
            console.log('error deleting clue:', err);
        }
        fetchGames();
    }
    
    async function deletePuzzle(props: {puzzleID: string; puzzleName: string}) {
        console.log("props.puzzleID: " + props.puzzleID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GamePuzzle.delete({ id: props.puzzleID });
            console.log("delete puzzleName: " + props.puzzleName);
            deleteGameNameBackup(props.puzzleName);
        } catch (err) {
            console.log('error deleting puzzle:', err);
        }
        fetchGames();
    }
    
    async function deleteTextField(props: {textFieldID: string; textFieldName: string}) {
        console.log("props.textFieldID: " + props.textFieldID);
        try {
            const client = dataService.getAuthClient();
            await client.models.TextField.delete({ id: props.textFieldID });
            console.log("delete textFieldName: " + props.textFieldName);
            deleteGameNameBackup(props.textFieldName);
        } catch (err) {
            console.log('error deleting textField:', err);
        }
        fetchGames();
    }

    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (on load)");
        fetchGames();
        fetchCities();
        if (localStorage.getItem("backup")!=null) {
            setFormCreateGameStateBackup(JSON.parse(localStorage.getItem("backup")));
            let backupGame;
            backupGame = JSON.parse(localStorage.getItem("backup"));
            let newObject = {};
            for (let i=0; i<backupGame.gamePlayZone?.items?.length; i++) {
                let key = "id-" + backupGame.gamePlayZone.items[i].id;
                let value = backupGame.gamePlayZone.items[i].gameZoneName;
                newObject = {...newObject,[key]:value};
            }
            console.log("gamePlayZoneObjectBackup: " + JSON.stringify(newObject));
            setGamePlayZoneObjectBackup(newObject);
        }
    }, []);
    
    function deleteBackup() {
        localStorage.removeItem("backup");
        setFormCreateGameStateBackup({"gameName":"New"});
    }
    
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (gamesFilter)");
        fetchGames();
    }, [gamesFilter]);

    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (updatedDB");
        setModalContent({
            open: false,
            content: "",
            id: "",
            action: "",
            updatedDB:false
        })
        fetchGames();
    }, [modalContent.updatedDB]);

    function setGameVisibleFunction(gameID: string, index: number, gameDesigner: string) {
        setGameVisible(gameID);
        setGameDesigner(gameDesigner);
        setGameIndex(index);
        let newObject = {};
        for (let i=0; i<games[index].gamePlayZone?.length; i++) {
            let key = games[index].gamePlayZone[i].id;
            let value = games[index].gamePlayZone[i].gameZoneName;
            newObject = {...newObject,[key]:value};
        }
        setGamePlayZoneObject(newObject);
        let nameBackupArray = [];
        for (let i=0; i<games[index].gamePlayZone?.length; i++)  {
            nameBackupArray.push(games[index].gamePlayZone[i].gameZoneName);
        }
        console.log("nameBackupArray: " + JSON.stringify(nameBackupArray));
        setGameNameBackupArray(nameBackupArray);
    }
    
    function handleCityForm() {
        setModalContent({
            open: true,
            content: "City Form",
            id: "",
            gameID:"",
            zoneID:"",
            action: "",
            updatedDB:false
        })
    }
    
    function handleStats(props: {gameID: string; gameName: string}) {
        setModalContent({
            open: true,
            content: "Stats",
            id: props.gameID,
            gameID:"",
            zoneID:"",
            action: props.gameName,
            updatedDB:false
        })
    }
    
    function handleGameForm(props: {gameID: string; action: string}) {
        console.log("handleGameForm");
        setModalContent({
            open: true,
            content: "Game Form",
            id: props.gameID,
            gameID:"",
            zoneID:"",
            action: props.action,
            updatedDB:false
        })
    }
    
    function handleZoneForm(props: {gameID?: string; zoneID?: string; zone?: any; action: string}) {
        setModalContent({
            open: true,
            content: "Zone Form",
            id: props.zoneID,
            gameID:props.gameID,
            zoneID:"",
            action: props.action,
            updatedDB:false
        })
        if (props.action === "addBackupZone") {
            addGameNameBackup(props.zone.gameZoneName);
        }
    }
    
    const handlePuzzleForm = ({puzzleID, gameID, zoneID, action}) => {
        console.log("zoneID (handle puzzle form): " + zoneID);
        if (action === "addBackupPuzzle" && (zoneID === "select zone" || zoneID === "" || zoneID === undefined)) {
            alert("Please select zone")
        } else {
            setModalContent({
                open: true,
                content: "Puzzle Form",
                id: puzzleID,
                gameID:gameID,
                zoneID:zoneID,
                action: action,
                updatedDB:false
            })
        }
        if (action === "addBackupPuzzle") {
            addGameNameBackup(puzzle.puzzleName);
        }
    };

    function handleTextFieldForm({action, puzzleID, textField, textFieldID}) {
        if (action === "addBackupTextField" && (puzzleID === "select puzzle" || puzzleID === "" || puzzleID === undefined)) {
            alert("Please select puzzle")
        } else {
            setModalContent({
                open: true,
                content: "TextField Form",
                id: textFieldID,
                puzzleID: puzzleID,
                action: action,
                updatedDB: false
            })
        }
        if (action === "addBackupTextField") {
            addGameNameBackup(textField.name);
        }
    }

    function handleClueForm(props: {clueID?: string; gameID?: string; zoneID?: string; action: string}) {
        console.log("zoneID (handle clue form): " + props.zoneID);
        if (props.action === "addBackupClue" && (props.zoneID === "select zone" || props.zoneID === "" || props.zoneID === undefined)) {
            alert("Please select zone")
        } else {
            console.log("zoneID (handle clue form): " + props.zoneID);
            setModalContent({
                open: true,
                content: "Clue Form",
                id: props.clueID,
                gameID: props.gameID,
                zoneID: props.zoneID,
                action: props.action,
                updatedDB: false
            })
        }
        if (props.action === "addBackupClue") {
            addGameNameBackup(props.clue.gameClueName);
        }
    }
    
    function handleHintForm(props: {hintID?: string; gameID?: string; zoneID?: string; action: string}) {
        console.log("zoneID (handle hint form): " + props.zoneID);
        if (props.action === "addBackupHint" && (props.zoneID === "select zone" || props.zoneID === "" || props.zoneID === undefined)) {
            alert("Please select zone")
        } else {
            setModalContent({
                open: true,
                content: "Hint Form",
                id: props.hintID,
                gameID: props.gameID,
                zoneID: props.zoneID,
                action: props.action,
                updatedDB: false
            })
        }
        if (props.action === "addBackupHint") {
            addGameNameBackup(props.hint.gameHintName);
        }
    }
    
    const [backupPuzzleValue, setBackupPuzzleValue] = useState("select puzzle");
    const [backupZoneValue, setBackupZoneValue] = useState("select zone");
    const [puzzleZoneValue, setPuzzleZoneValue] = useState("select zone");
    const [clueZoneValue, setClueZoneValue] = useState("select zone")
    const [hintZoneValue, setHintZoneValue] = useState("select zone")
    
    const BackupPuzzleDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={backupPuzzleValue}
                onChange={(e) => setBackupPuzzleValue(e.target.value)} label={""}>
                <option value="select zone">select puzzle</option>
                {props.visibleGame.gamePuzzle?.map((puzzle) => (
                    <option key={puzzle.id} value={puzzle.id}>{puzzle.puzzleName}</option>
                ))}
            </SelectField>)
    }
    
    const BackupZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={backupZoneValue}
                onChange={(e) => setBackupZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone?.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    
    const PuzzleZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
            className={"city-dropdown"}
            paddingTop={"3px"}
            value={puzzleZoneValue}
            onChange={(e) => setPuzzleZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone?.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    
    const ClueZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={clueZoneValue}
                onChange={(e) => setClueZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone?.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    
    const HintZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={hintZoneValue}
                onChange={(e) => setHintZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone?.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    
    const CityDropDown = () => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                placeholder={"choose a city"}
                value={cityValue}
                onChange={(e) => {
                    setCityValue(e.target.value);setFilterCreateGame("gameLocationCity", {eq: e.target.value})}}>
                {cities.map((city) => (
                    <option key={city.id} value={city.cityName}>{city.cityName}</option>
                ))}
            </SelectField>)
    }

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
        <View>
            <View id="gameSection" className="show section">
                <Flex>
                    <Heading level={4} color="black">Games</Heading>
                <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                        onClick={() => handleGameForm({"gameID": "", "action": "add"})}>
                    <span style={{fontSize: "20px"}}>+</span> add new game</Button>
                    <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                            onClick={() => handleGameForm({"gameID": "", "action": "addFromFile"})}>
                        <span style={{fontSize: "20px"}}>+</span> add backup/copy of game</Button>
                    {
                        (formCreateGameStateBackup.gameName !== "New" && formCreateGameStateBackup.gameName !== "") &&
                        <View paddingTop={"10px"} className={"small"}><strong>{formCreateGameStateBackup.gameName}</strong> backup is available.
                            <Button gap="0.1rem" size="small" color="red" onClick={() => deleteBackup()}>
                                x
                            </Button></View>
                    }
                </Flex>
            <Flex gap={".2rem"} >
                <Button gap="0.1rem" size="small" className={(gameType==="all")? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame()}>all</Button>
                <Button gap="0.1rem" size="small" className={(disabledGame === false) ? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("disabled", {eq: false})}>live</Button>
                <Button gap="0.1rem" size="small" className={(disabledGame === true)? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("disabled", {eq: true})}>disabled</Button>
                <Button gap="0.1rem" size="small" className={(gameType === "free")? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("gameType", {eq: "free"})}>free</Button>
                <CityDropDown />
                <Button gap="0.1rem" marginRight="10px" size="small"
                        onClick={() => handleCityForm()}>manage cities</Button>

            </Flex>
                <Table
                    highlightOnHover={true}
                    size={"default"}
                    variation={"striped"}
                >
                    {(gameVisible === "") && <TableHead>
                    <TableRow>
                        <TableCell as="th"/>
                        <TableCell as="th">Game Name</TableCell>
                        <TableCell as="th">Type</TableCell>
                        <TableCell as="th">Place</TableCell>
                        <TableCell as="th">City</TableCell>
                        <TableCell as="th">Level</TableCell>
                        <TableCell as="th">Designer</TableCell>
                        <TableCell as="th">Live</TableCell>
                        <TableCell as="th">Actions</TableCell>

                    </TableRow>
                </TableHead>}
                    <TableBody>
                {games.map((game, index) => (
                    <TableRow key={game.id}>
                        {(gameVisible === "") &&
                        <>
                        <TableCell><Button gap="0.1rem" size="large"  className="plus-minus"  onClick={() => setGameVisibleFunction(game.id, index, game.gameDesigner)}>+</Button>
                        </TableCell>
                        <TableCell>{game.gameName}</TableCell>
                        <TableCell>{game.gameType}</TableCell>
                        <TableCell>{game.gameLocationPlace}</TableCell>
                        <TableCell>{game.gameLocationCity}</TableCell>
                        <TableCell>{game.gameLevel}</TableCell>
                        <TableCell>{game.gameDesigner}</TableCell>
                            <TableCell>{game.disabled ? "no" : "yes"}</TableCell>
                        <TableCell>

                            <Button gap="0.1rem" marginRight="10px" size="small"
                                    onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                            <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                "gameID": game.id,
                                "gameName": game.gameName
                            })}>copy</Button>
                            <Button gap="0.1rem" size="small" onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>

                        </TableCell>

                        </>}

                    {(gameVisible === game.id) &&
                        <TableCell colSpan={9} className={"border1"}>
                            <Flex  direction="row"
                                   justifyContent="flex-start"
                                   marginBottom={"30px"}
                                   gap={".1rem"}
                                   className={"game-detail-row"}>
                                <Button gap="0.1rem" size="small" className="plus-minus" onClick={() => setGameVisible("")}>-</Button>
                                <Heading level={5} color="black" marginRight={"1rem"}>

                                    {game.gameName}:  </Heading>
                                <Button gap="0.1rem" marginRight="10px" size="small"
                                        onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                                <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                    "gameID": game.id,
                                    "gameName": game.gameName
                                })}>copy</Button>
                                <Button gap="0.1rem" size="small" onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>

                            </Flex>
                            <Table
                                highlightOnHover={true}
                                size={"default"}
                                variation={"striped"}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell as="th">Name</TableCell>
                                        <TableCell as="th">Type</TableCell>
                                        <TableCell as="th">Place</TableCell>
                                        <TableCell as="th">City</TableCell>
                                        <TableCell as="th">Level</TableCell>
                                        <TableCell as="th">Live</TableCell>
                                        <TableCell as="th">Designer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                            <TableRow>
                                <TableCell><strong>{game.gameName}</strong></TableCell>
                                <TableCell>{game.gameType}</TableCell>
                                <TableCell>{game.gameLocationPlace}</TableCell>
                                <TableCell>{game.gameLocationCity}</TableCell>
                                <TableCell>{game.gameLevel}</TableCell>
                                <TableCell>{game.disabled ? "No" : "Yes"}</TableCell>
                                <TableCell>{game.gameDesigner}  </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}><strong>Description</strong>:<br /> {game.gameDescription} </TableCell>
                                <TableCell colSpan={3}><strong>Summary</strong>:<br /> {game.gameSummary} </TableCell>
                                <TableCell colSpan={2}><strong>Logistic Information</strong>: <br /> {game.gameLogisticInfo}  </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Goals</strong>:<br /> {game.gameGoals} </TableCell>
                                <TableCell><strong>Order</strong>:<br /> {game.order} </TableCell>
                                <TableCell><strong>Latitude</strong>:<br /> {game.latitude} </TableCell>
                                <TableCell><strong>Longitude</strong>:<br /> {game.longitude} </TableCell>
                                <TableCell><strong>Walking Distance</strong>: <br />{game.walkingDistance} </TableCell>
                                <TableCell colSpan={2}><strong>Win Message</strong>: <br />{game.gameWinMessage} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Zones</Heading>
                                        <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                                                onClick={() => handleZoneForm({"gameID": game.id, "zoneID": "", "action": "add"})}>
                                            <span style={{fontSize: "20px"}}>+</span> add zone</Button>

                                    </Flex>
                                    {
                                        (formCreateGameStateBackup.gameName !== "New" && formCreateGameStateBackup.gamePlayZone?.items?.length > 0) &&
                                        <Button  onClick={() => setZoneBackup(!zoneBackup)}>
                                            {(zoneBackup)? "backup zones, show live zone" : "live zones, show backup zones"}</Button>
                                    }
                                    {zoneBackup?
                                        (<Table
                                        highlightOnHover={true}
                                        size={"default"}
                                        variation={"bordered"}
                                        className={"zone"}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell as="th">Name</TableCell>
                                                <TableCell as="th">Ord</TableCell>
                                                <TableCell as="th">Lat</TableCell>
                                                <TableCell as="th">Long</TableCell>
                                                <TableCell as="th">Image</TableCell>
                                                <TableCell as="th">Description</TableCell>
                                                <TableCell as="th">Live</TableCell>
                                                <TableCell as="th">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {formCreateGameStateBackup.gamePlayZone?.items?.map((zone) => (
                                            <TableRow key={zone.id}>
                                                <TableCell> {zone.gameZoneName} {(gameNameBackupArray.includes(zone.gameZoneName)) && <GreenIcon />}</TableCell>
                                                <TableCell> {zone.order}</TableCell>
                                                <TableCell> {zone.latitude}</TableCell>
                                                <TableCell> {zone.longitude}</TableCell>
                                                <TableCell><Image width={"50px"} src={zone.gameZoneImage} alt={"gameZoneImage"}/></TableCell>
                                                <TableCell> {zone.gameZoneDescription}</TableCell>
                                                <TableCell>  {zone.disabled ? "No" : "Yes"} </TableCell>
                                                <TableCell>
                                                    <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                                                            onClick={() => handleZoneForm({"gameID": game.id, "zoneID": "", "zone":zone, "action": "addBackupZone"})}>
                                                        <span style={{fontSize: "20px"}}>+</span> add backup zone</Button>

                                                </TableCell>


                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>):
                                        (<Table
                                            highlightOnHover={true}
                                            size={"default"}
                                            variation={"bordered"}
                                            className={"zone"}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell as="th">Name</TableCell>
                                                    <TableCell as="th">Ord</TableCell>
                                                    <TableCell as="th">Lat</TableCell>
                                                    <TableCell as="th">Long</TableCell>
                                                    <TableCell as="th">Image</TableCell>
                                                    <TableCell as="th">Description</TableCell>
                                                    <TableCell as="th">Live</TableCell>
                                                    <TableCell as="th">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {game.gamePlayZone?.map((zone) => (
                                                    <TableRow key={zone.id}>
                                                        <TableCell> {zone.gameZoneName}</TableCell>
                                                        <TableCell> {zone.order}</TableCell>
                                                        <TableCell> {zone.latitude}</TableCell>
                                                        <TableCell> {zone.longitude}</TableCell>
                                                        <TableCell><Image width={"50px"} src={zone.gameZoneImage} alt={"gameZoneImage"}/></TableCell>
                                                        <TableCell> {zone.gameZoneDescription}</TableCell>
                                                        <TableCell>  {zone.disabled ? "No" : "Yes"} </TableCell>
                                                        <TableCell>
                                                            <Button gap="0.1rem" size="small"
                                                                    onClick={() => handleZoneForm({"zoneID": zone.id, "action": "edit"})}>edit</Button>
                                                            <Button gap="0.1rem" size="small"
                                                                    onClick={() => handlePuzzleForm({"puzzleID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> puzzle</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleHintForm({"hintID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> hint</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleClueForm({"clueID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> clue</Button>
                                                            {(gamePlayZoneObject[(zone.id)] == null) &&  <Button  gap="0.1rem" size="small" color={"yellow"}
                                                                                                                          onClick={() => setGameVisibleFunction(gameVisible, gameIndex, gameDesigner)}>set zone</Button>}
                                                            <Button  gap="0.1rem" size="small" color={"red"}
                                                                     onClick={() => deleteZone({"zoneID": zone.id, "gameZoneName": zone.gameZoneName})}>x</Button>
                                                        </TableCell>


                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>)}


                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Puzzles</Heading>
                                        {!puzzleBackup && <PuzzleZoneDropDown visibleGame={game}/>}
                                    </Flex>
                                    {
                                        (formCreateGameStateBackup.gameName !== "New" && formCreateGameStateBackup.gamePuzzle?.items?.length > 0) &&
                                        <Button  onClick={() => setPuzzleBackup(!puzzleBackup)}>
                                            {(puzzleBackup)? "backup puzzles, show live puzzles" : "live puzzles, show backup puzzles"}</Button>
                                    }
                                    {puzzleBackup ?
                                        (<>
                                            {formCreateGameStateBackup.gamePuzzle?.items?.map((puzzle) => (
                                                <View className={"border1"} key={puzzle.id}>
                                                    <Table
                                                        highlightOnHover={true}
                                                        size={"default"}
                                                        variation={"bordered"}
                                                        key={puzzle.id}
                                                        className={(puzzleZoneValue !== puzzle.gamePlayZoneID) && puzzleZoneValue !== "select zone" ? "hide" : "puzzle"}
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell as="th">Name</TableCell>
                                                                <TableCell as="th">Order</TableCell>
                                                                <TableCell as="th">PlayZone</TableCell>
                                                                <TableCell as="th">Puzzle Clue Text (revealed)</TableCell>
                                                                <TableCell as="th">Puzzle Clue Revealed (image)</TableCell>
                                                                <TableCell as="th">WinGame</TableCell>
                                                                <TableCell as="th">live</TableCell>
                                                                <TableCell as="th">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow key={puzzle.id}>
                                                                <TableCell>{puzzle.puzzleName} {(gameNameBackupArray.includes(puzzle.puzzleName)) && <GreenIcon />}</TableCell>
                                                                <TableCell>{puzzle.order}</TableCell>
                                                                <TableCell>{gamePlayZoneObjectBackup[("id-" + puzzle.gamePlayZoneID)]}</TableCell>
                                                                <TableCell>{puzzle.puzzleClueText}</TableCell>
                                                                <TableCell>
                                                                    <Image width={"50px"}
                                                                           src={puzzle.puzzleClueRevealed} alt={"clueRevealed"}/></TableCell>
                                                                <TableCell>{puzzle.winGame ? "true" : "false"}</TableCell>
                                                                <TableCell>{puzzle.disabled ? "No" : "Yes"}</TableCell>
                                                                <TableCell>
                                                                    <Button gap="0.1rem" size="small"
                                                                            onClick={() => handlePuzzleForm({
                                                                                "puzzleID": "",
                                                                                "puzzle": puzzle,
                                                                                "gameID": game.id,
                                                                                "zoneID": backupZoneValue,
                                                                                "action": "addBackupPuzzle"
                                                                            })}>add backup puzzle</Button>
                                                                    <BackupZoneDropDown visibleGame={game}/>


                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell colSpan={8}>
                                                                    <Flex>
                                                                        <Heading level={6} color="black"
                                                                                 paddingTop={"5px"}>TextFields</Heading>
                                                                    </Flex>
                                                                    <Table
                                                                        highlightOnHover={true}
                                                                        size={"default"}
                                                                        variation={"bordered"}
                                                                        className={"textfield"}
                                                                    >
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell as="th">Name</TableCell>
                                                                                <TableCell as="th">Order</TableCell>
                                                                                <TableCell as="th">Label</TableCell>
                                                                                <TableCell as="th">Answer</TableCell>
                                                                                <TableCell as="th">Live</TableCell>
                                                                                <TableCell as="th">Actions</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {puzzle.textField?.map((textField) => (
                                                                                <TableRow key={textField.id}>
                                                                                    <TableCell>{textField.name} {(gameNameBackupArray.includes(textField.name)) && <GreenIcon />}</TableCell>
                                                                                    <TableCell> {textField.order}</TableCell>
                                                                                    <TableCell> {textField.label}</TableCell>
                                                                                    <TableCell>{textField.answer}</TableCell>
                                                                                    <TableCell>{textField.disabled ? "No" : "Yes"}</TableCell>
                                                                                    <TableCell>
                                                                                        <Flex>
                                                                                            <Button gap="0.1rem" marginBottom="0"
                                                                                                    size="small" className={"blue-duke"}
                                                                                                    onClick={() => handleTextFieldForm({
                                                                                                        "puzzleID": backupPuzzleValue,
                                                                                                        "textField": textField,
                                                                                                        "action": "addBackupTextField"
                                                                                                    })}><span style={{fontSize: "20px"}}>+</span> add backup textfield</Button>
                                                                                            <BackupPuzzleDropDown visibleGame={game}/>
                                                                                        </Flex>
                                                                                    </TableCell>
                                                                                </TableRow>

                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </View>
                                            ))}</>) :
                                        (<>{game.gamePuzzle?.map((puzzle) => (
                                            <View className={"border1"} key={puzzle.id}>
                                                <Table
                                                    highlightOnHover={true}
                                                    size={"default"}
                                                    variation={"bordered"}
                                                    key={puzzle.id}
                                                    className={(puzzleZoneValue !== puzzle.gamePlayZoneID) && puzzleZoneValue !== "select zone" ? "hide" : "puzzle"}
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell as="th">Name</TableCell>
                                                            <TableCell as="th">Order</TableCell>
                                                            <TableCell as="th">PlayZone</TableCell>
                                                            <TableCell as="th">Puzzle Clue Text (revealed)</TableCell>
                                                            <TableCell as="th">Puzzle Clue Revealed (image)</TableCell>
                                                            <TableCell as="th">WinGame</TableCell>
                                                            <TableCell as="th">Live</TableCell>
                                                            <TableCell as="th">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow key={puzzle.id}>
                                                            <TableCell>{puzzle.puzzleName}</TableCell>
                                                            <TableCell>{puzzle.order}</TableCell>
                                                            <TableCell>{gamePlayZoneObject[(puzzle.gamePlayZoneID)]}</TableCell>
                                                            <TableCell>{puzzle.puzzleClueText}</TableCell>
                                                            <TableCell>
                                                                <Image width={"50px"}
                                                                       src={puzzle.puzzleClueRevealed} alt={"clueRevealed"}/></TableCell>
                                                            <TableCell>{puzzle.winGame ? "true" : "false"}</TableCell>
                                                            <TableCell>{puzzle.disabled ? "No" : "Yes"}</TableCell>
                                                            <TableCell>
                                                                <Button gap="0.1rem" size="small"
                                                                        onClick={() => handlePuzzleForm({
                                                                            "puzzleID": puzzle.id,
                                                                            "gameID": game.id,
                                                                            "zoneID": puzzle.gamePlayZoneID,
                                                                            "action": "edit"
                                                                        })}>edit</Button>
                                                                {(puzzle.textField?.length < 1) &&
                                                                <Button gap="0.1rem" size="small" color={"red"}
                                                                        onClick={() => deletePuzzle({"puzzleID": puzzle.id,"puzzleName":puzzle.puzzleName})}>x</Button>}

                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <Flex>
                                                                    <Heading level={6} color="black"
                                                                             paddingTop={"5px"}>TextFields</Heading>
                                                                    <Button gap="0.1rem" marginBottom="1rem"
                                                                            size="small" className={"blue-duke"}
                                                                            onClick={() => handleTextFieldForm({
                                                                                "puzzleID": puzzle.id,
                                                                                "action": "add"
                                                                            })}>
                                                                            <span
                                                                                style={{fontSize: "20px"}}>+</span> add
                                                                        textfield</Button>
                                                                </Flex>
                                                                <Table
                                                                    highlightOnHover={true}
                                                                    size={"default"}
                                                                    variation={"bordered"}
                                                                    className={"textfield"}
                                                                >
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell as="th">Name</TableCell>
                                                                            <TableCell as="th">Order</TableCell>
                                                                            <TableCell as="th">Label</TableCell>
                                                                            <TableCell as="th">Answer</TableCell>
                                                                            <TableCell as="th">Live</TableCell>
                                                                            <TableCell as="th">Actions</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {puzzle.textField?.map((textField) => (
                                                                            <TableRow key={textField.id}>
                                                                                <TableCell>{textField.name}</TableCell>
                                                                                <TableCell> {textField.order}</TableCell>
                                                                                <TableCell> {textField.label}</TableCell>
                                                                                <TableCell>{textField.answer}</TableCell>
                                                                                <TableCell>{textField.disabled ? "No" : "Yes"}</TableCell>
                                                                                <TableCell>
                                                                                    <>
                                                                                        <Button gap="0.1rem"
                                                                                                size="small"
                                                                                                onClick={() => handleTextFieldForm({
                                                                                                    "textFieldID": textField.id,
                                                                                                    "action": "edit"
                                                                                                })}>edit</Button>
                                                                                        <Button gap="0.1rem"
                                                                                                size="small"
                                                                                                color={"red"}
                                                                                                onClick={() => deleteTextField({"textFieldID": textField.id,"textFieldName": textField.name})}>x</Button>
                                                                                    </>
                                                                                </TableCell>
                                                                            </TableRow>

                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </View>
                                        ))}</>)
                                    }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Flex>
                                <Heading level={4} color="black" >Clues</Heading><ClueZoneDropDown visibleGame={game}/>
                                </Flex>
                                {
                                    (formCreateGameStateBackup.gameName !== "New" && formCreateGameStateBackup.gameClue?.items?.length > 0) &&
                                    <Button  onClick={() => setClueBackup(!clueBackup)}>
                                        {(clueBackup)? "backup clues, show live clues" : "live clues, show backup clues"}</Button>
                                }
                                <Table
                                    highlightOnHover={true}
                                    size={"default"}
                                    variation={"bordered"}

                                >
                                <TableHead>
                                        <TableRow>
                                            <TableCell as="th">Name</TableCell>
                                            <TableCell as="th">Zone</TableCell>
                                            <TableCell as="th">Text</TableCell>
                                            <TableCell as="th">Icon</TableCell>
                                            <TableCell as="th">Image</TableCell>
                                            <TableCell as="th">Disabled</TableCell>
                                            <TableCell as="th">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {(clueBackup) ?
                                        (
                                            <TableBody>

                                {formCreateGameStateBackup.gameClue?.items?.map((clue) => (
                                    <TableRow key={clue.id} className={(clueZoneValue !== clue.gamePlayZoneID) && clueZoneValue !== "select zone"? "hide":"clue"}>
                                        <TableCell>{clue.gameClueName} {(gameNameBackupArray.includes(clue.gameClueName)) && <GreenIcon />}</TableCell>
                                        <TableCell>{gamePlayZoneObjectBackup[("id-" + clue.gamePlayZoneID)]} | {clue.gamePlayZoneID}</TableCell>
                                        <TableCell>{clue.gameClueText} </TableCell>
                                        <TableCell><IconClueDisplay hide="true" gameClueIcon={clue.gameClueIcon}/> </TableCell>
                                        <TableCell><Image width={"50px"} src={clue.gameClueImage} alt={"gameClueImage"}/></TableCell>
                                        <TableCell>{clue.disabled ? "true" : "false"}</TableCell>
                                        <TableCell>
                                            <Button gap="0.1rem" size="small"
                                                    onClick={() => handleClueForm({
                                                        "clueID": "",
                                                        "clue": clue,
                                                        "gameID": game.id,
                                                        "zoneID": backupZoneValue,
                                                        "action": "addBackupClue"
                                                    })}>add backup clue</Button>
                                            <BackupZoneDropDown visibleGame={game}/>

                                        </TableCell>
                                    </TableRow>
                                ))}
                                    </TableBody>) :
                                        ( <TableBody>

                                    {game.gameClue?.map((clue) => (
                                        <TableRow key={clue.id} className={(clueZoneValue !== clue.gamePlayZoneID) && clueZoneValue !== "select zone"? "hide":"clue"}>
                                        <TableCell>{clue.gameClueName}</TableCell>
                                        <TableCell>{gamePlayZoneObject[(clue.gamePlayZoneID)]}</TableCell>
                                        <TableCell>{clue.gameClueText} </TableCell>
                                        <TableCell><IconClueDisplay hide="true" gameClueIcon={clue.gameClueIcon}/></TableCell>
                                        <TableCell><Image width={"50px"} src={clue.gameClueImage} alt={"gameClueImage"}/></TableCell>
                                        <TableCell>{clue.disabled ? "true" : "false"}</TableCell>
                                        <TableCell>
                                        <Button gap="0.1rem" size="small"
                                        onClick={() => handleClueForm({"clueID": clue.id, "gameID": game.id, "zoneID": clue.gamePlayZoneID, "action": "edit"})}>edit</Button>
                                        <Button gap="0.1rem" size="small" color={"red"}
                                        onClick={() => deleteClue({"clueID": clue.id,"gameClueName":clue.gameClueName})}>x</Button>

                                        </TableCell>
                                        </TableRow>
                                        ))}
                                        </TableBody>)}



                                </Table>
                            </TableCell>
                        </TableRow>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Flex>
                                            <Heading level={4} color="black" >Hints</Heading><HintZoneDropDown visibleGame={game}/>
                                        </Flex>
                                        {
                                            (formCreateGameStateBackup.gameName !== "New" && formCreateGameStateBackup.gameHint?.items?.length > 0) &&
                                            <Button  onClick={() => setHintBackup(!hintBackup)}>
                                                {(hintBackup)? "backup hints, show live hints" : "live hints, show backup hints"}</Button>
                                        }
                                        <Table
                                            highlightOnHover={true}
                                            size={"default"}
                                            variation={"bordered"}
                                            className={"zone"}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell as="th">Name</TableCell>
                                                    <TableCell as="th">Order</TableCell>
                                                    <TableCell as="th">Zone</TableCell>
                                                    <TableCell as="th">Description</TableCell>
                                                    <TableCell as="th">Disabled</TableCell>
                                                    <TableCell as="th">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {(hintBackup) ?
                                                (
                                            <TableBody>
                                {formCreateGameStateBackup.gameHint?.items?.map((hint) => (
                                        <TableRow key={hint.id} className={(hintZoneValue !== hint.gamePlayZoneID) && hintZoneValue !== "select zone"? "hide":"clue"}>
                                            <TableCell>{hint.gameHintName}  {(gameNameBackupArray.includes(hint.gameHintName)) && <GreenIcon />}</TableCell>
                                            <TableCell>{hint.order}</TableCell>
                                            <TableCell>{gamePlayZoneObjectBackup[("id-" + hint.gamePlayZoneID)]}| {hint.gamePlayZoneID}</TableCell>
                                            <TableCell>{hint.gameHintDescription}</TableCell>
                                            <TableCell>{hint.disabled ? "true" : "false"}</TableCell>
                                            <TableCell>
                                                <Button gap="0.1rem" size="small"
                                                        onClick={() => handleHintForm({
                                                            "hintID": "",
                                                            "hint": hint,
                                                            "gameID": game.id,
                                                            "zoneID": backupZoneValue,
                                                            "action": "addBackupHint"})}>add backup hint</Button>

                                                <BackupZoneDropDown visibleGame={game}/>
                                            </TableCell>
                                        </TableRow>
                                ))}
                                            </TableBody>):(
                                                    <TableBody>
                                                        {game.gameHint?.map((hint) => (
                                                            <TableRow key={hint.id} className={(hintZoneValue !== hint.gamePlayZoneID) && hintZoneValue !== "select zone"? "hide":"clue"}>
                                                                <TableCell>{hint.gameHintName}</TableCell>
                                                                <TableCell>{hint.order}</TableCell>
                                                                <TableCell>{gamePlayZoneObject[(hint.gamePlayZoneID)]}</TableCell>
                                                                <TableCell>{hint.gameHintDescription}</TableCell>
                                                                <TableCell>{hint.disabled ? "true" : "false"}</TableCell>
                                                                <TableCell>
                                                                    <Button gap="0.1rem" size="small"
                                                                            onClick={() => handleHintForm({"hintID": hint.id, "gameID": game.id, "zoneID": hint.gamePlayZoneID, "action": "edit"})}>edit</Button>
                                                                    <Button gap="0.1rem" size="small" color={"red"}
                                                                            onClick={() => deleteHint({"hintID": hint.id,"hintName":hint.gameHintName})}>x</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                )}
                                        </Table>
                            </TableCell>
                        </TableRow>
                                </TableBody>
                            </Table>
                            <Flex  direction="row"
                                   justifyContent="center"
                                   marginBottom={"30px"}
                                   gap={".1rem"}
                                   className={"game-detail-row"}>
                                <Heading level={5} color="black" marginRight={"1rem"}>End Game Detail: {game.gameName}:  </Heading>
                                <Button gap="0.1rem" size="small"
                                        onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>
                                <Button gap="0.1rem" size="small"
                                        onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                                <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                    "gameID": game.id,
                                    "gameName": game.gameName
                                })}>copy</Button>
                                <Button gap="0.1rem" size="small" onClick={() => setGameVisible("")}>close</Button>
                                {((game.gameClue?.length < 1) && (game.gameHint?.length < 1) && (game.gamePuzzle?.length < 1) && (game.gamePlayZone?.length < 1)) &&
                                <Button gap="0.1rem" size="small" color="red" onClick={() => deleteGame({"gameID": game.id})}>
                                    x
                                </Button>}

                           </Flex>
                        </TableCell>

                    }
                    </TableRow>
                ))}
                   </TableBody>
                </Table>
            </View>



        </View>)
}