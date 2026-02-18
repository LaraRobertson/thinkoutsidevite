import {Button, Flex, Heading, View, Image,
    Table, TableCell, TableBody, TableHead, TableRow, SelectField} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import {IconClueDisplay} from "../sharedComponents";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";
import {getDefaultModalContent, createModalContent, updateSingleGame} from "../../utils/modalHelpers";

type Game = Schema["Game"]["type"];
type City = Schema["City"]["type"];

export default function GameSection() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;
    const [cityValue, setCityValue] = React.useState("");
    const [games, setGames] = useState<Game[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [gameType, setGameType] = useState("all");
    const [gameVisible, setGameVisible] = useState("");
    //const [gameDesigner, setGameDesigner] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [gamePlayZoneObject, setGamePlayZoneObject] = useState<Record<string, any>>({});

    const [disabledGame, setDisabledGame] = useState<boolean | string | undefined>();
    const [gamesFilter, setGamesFilter] = useState<Record<string, {eq: string | boolean}>>({type: {eq:"game"}});
    
    function setFilterCreateGame(key?: string, value?: {eq: string | boolean}) {
        console.log("setFilterCreateGame: " + key);
        if (key && value) {
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
        setGameVisible("");
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
                filter: gamesFilter,
                selectionSet: ['id', 'gameName', 'gameDescription', 'gameLogisticInfo', 'gameSummary', 'gameLocationPlace', 'latitude', 'longitude', 'gameLocationPlaceDetails', 'gameLocationCity', 'gameDesigner', 'gameLevel', 'walkingDistance', 'playZones', 'gameImage', 'gameType', 'gameWinMessage', 'gameWinImage', 'gameGoals', 'gameIntro', 'gameMap', 'type', 'order', 'disabled', 'userID', 'createdAt', 'updatedAt', 'gamePlayZone.*', 'gameHint.*', 'gameClue.*', 'gamePuzzle.*', 'gamePuzzle.textField.*']
            });
            console.log("Games with filter and related data:", gamesFromAPI?.length, "games");
            console.log("Filtered games data:", gamesFromAPI);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setGames(gamesFromAPI as any);
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
            //setGameDesigner("");
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
        } catch (err) {
            console.log('error deleting zone:', err);
        }
        /* close Modal/update single game */
        setModalContent(updateSingleGame());
    }

    async function deleteHint(props: {hintID: string; hintName: string}) {
        console.log("props.hintID: " + props.hintID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameHint.delete({ id: props.hintID });
            console.log("delete textFieldName: " + props.hintName);
        } catch (err) {
            console.log('error deleting hint:', err);
        }
        /* close Modal/update single game */
        setModalContent(updateSingleGame());
    }

    async function deleteClue(props: {clueID: string; gameClueName: string}) {
        console.log("props.clueID: " + props.clueID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameClue.delete({ id: props.clueID });
            console.log("delete clueName: " + props.gameClueName);
        } catch (err) {
            console.log('error deleting clue:', err);
        }
        /* close Modal/update single game */
        setModalContent(updateSingleGame());
    }
    
    async function deletePuzzle(props: {puzzleID: string; puzzleName: string}) {
        console.log("props.puzzleID: " + props.puzzleID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GamePuzzle.delete({ id: props.puzzleID });
            console.log("delete puzzleName: " + props.puzzleName);
        } catch (err) {
            console.log('error deleting puzzle:', err);
        }
        /* close Modal/update single game */
        setModalContent(updateSingleGame());
    }
    
    async function deleteTextField(props: {textFieldID: string; textFieldName: string}) {
        console.log("props.textFieldID: " + props.textFieldID);
        try {
            const client = dataService.getAuthClient();
            await client.models.TextField.delete({ id: props.textFieldID });
            console.log("delete textFieldName: " + props.textFieldName);
        } catch (err) {
            console.log('error deleting textField:', err);
        }
        /* close Modal/update single game */
        setModalContent(updateSingleGame());
    }

    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (on load)");
        fetchGames();
        fetchCities();
    }, []);

    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (gamesFilter)");
        fetchGames();
    }, [gamesFilter]);

    useEffect(() => {
        if (modalContent.updatedDB && gameVisible) {
            console.log("***useEffect***: refreshing game after form update");
            fetchSingleGame(gameVisible);
            setModalContent(getDefaultModalContent());
        }
    }, [modalContent.updatedDB]);


    async function fetchSingleGame(gameID: string) {
        console.log("fetchSingleGame: " + gameID);
        setGames([]);
        try {
            const client = dataService.getClient();
            const { data: gameFromAPI } = await client.models.Game.get(
            {id: gameID},
            {
                selectionSet: ['id', 'gameName', 'gameDescription', 'gameLogisticInfo', 'gameSummary', 'gameLocationPlace', 'latitude', 'longitude', 'gameLocationPlaceDetails', 'gameLocationCity', 'gameDesigner', 'gameLevel', 'walkingDistance', 'playZones', 'gameImage', 'gameType', 'gameWinMessage', 'gameWinImage', 'gameGoals', 'gameIntro', 'gameMap', 'type', 'order', 'disabled', 'userID', 'createdAt', 'updatedAt', 'gamePlayZone.*', 'gameHint.*', 'gameClue.*', 'gamePuzzle.*', 'gamePuzzle.textField.*']
            }
            );
            if (gameFromAPI) {
                console.log("Single game data:", gameFromAPI);
                //const updatedGames = games.map(g => g.id === gameID ? gameFromAPI : g);
                //console.log("updatedGames:", updatedGames);
                //.get returns an object not an array
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setGames([gameFromAPI as any]);


                let newObject = {};
                const gamePlayZones = games[0]?.gamePlayZone;
                if (gamePlayZones && Array.isArray(gamePlayZones)) {
                    for (let i = 0; i < gamePlayZones.length; i++) {
                        const key = gamePlayZones[i].id;
                        const value = gamePlayZones[i].gameZoneName;
                        newObject = {...newObject, [key]: value};
                    }
                }
                setGamePlayZoneObject(newObject);
            }
        } catch (err) {
            console.error('error fetching single game:', err);
        }
    }

    function closeSingleGame() {
        setGameVisible("");
        //setGameDesigner("");
        fetchGames();
    }

    async function setGameVisibleFunction(gameID: string) {
        setGameVisible(gameID);
        //setGameDesigner(gameDesigner);
        await fetchSingleGame(gameID);
    }
    
    function handleCityForm() {
        setModalContent(createModalContent({
            open: true,
            content: "City Form"
        }))
    }
    
    function handleStats(props: {gameID: string; gameName: string}) {
        setModalContent(createModalContent({
            open: true,
            content: "Stats",
            id: props.gameID,
            action: props.gameName
        }))
    }
    
    function handleGameForm(props: {gameID: string; action: string}) {
        console.log("handleGameForm");
        setModalContent(createModalContent({
            open: true,
            content: "Game Form",
            id: props.gameID,
            action: props.action
        }))
    }
    
    function handleZoneForm(props: {gameID?: string; zoneID?: string; action: string; gameDesigner?: string;}) {
        setModalContent(createModalContent({
            open: true,
            content: "Zone Form",
            id: props.zoneID,
            gameID: props.gameID,
            action: props.action,
            gameDesigner: props.gameDesigner
        }))
    }
    
    const handlePuzzleForm = ({puzzleID, gameID, zoneID, action}: {puzzleID?: string; gameID?: string; zoneID?: string; action: string;}) => {
        console.log("zoneID (handle puzzle form): " + zoneID);
        if (action === "addBackupPuzzle" && (zoneID === "select zone" || zoneID === "" || zoneID === undefined)) {
            alert("Please select zone")
        } else {
            setModalContent(createModalContent({
                open: true,
                content: "Puzzle Form",
                id: puzzleID,
                gameID: gameID,
                zoneID: zoneID,
                action: action
            }))
        }
    };

    function handleTextFieldForm({action, puzzleID, textFieldID}: {action: string; puzzleID?: string; textFieldID?: string}) {
        if (action === "addBackupTextField" && (puzzleID === "select puzzle" || puzzleID === "" || puzzleID === undefined)) {
            alert("Please select puzzle")
        } else {
            setModalContent(createModalContent({
                open: true,
                content: "TextField Form",
                id: textFieldID,
                puzzleID: puzzleID,
                action: action
            }))
        }
    }

    function handleClueForm(props: {clueID?: string; gameID?: string; zoneID?: string; action: string}) {
        console.log("zoneID (handle clue form): " + props.zoneID);
        if (props.action === "addBackupClue" && (props.zoneID === "select zone" || props.zoneID === "" || props.zoneID === undefined)) {
            alert("Please select zone")
        } else {
            console.log("zoneID (handle clue form): " + props.zoneID);
            setModalContent(createModalContent({
                open: true,
                content: "Clue Form",
                id: props.clueID,
                gameID: props.gameID,
                zoneID: props.zoneID,
                action: props.action
            }))
        }
    }
    
    function handleHintForm(props: {hintID?: string; gameID?: string; zoneID?: string; action: string}) {
        console.log("zoneID (handle hint form): " + props.zoneID);
        if (props.action === "addBackupHint" && (props.zoneID === "select zone" || props.zoneID === "" || props.zoneID === undefined)) {
            alert("Please select zone")
        } else {
            setModalContent(createModalContent({
                open: true,
                content: "Hint Form",
                id: props.hintID,
                gameID: props.gameID,
                zoneID: props.zoneID,
                action: props.action
            }))
        }
    }

    const [puzzleZoneValue, setPuzzleZoneValue] = useState("select zone");
    const [clueZoneValue, setClueZoneValue] = useState("select zone");
    const [hintZoneValue, setHintZoneValue] = useState("select zone");

    function setAllZoneValue(props: {zoneID?: string}) {
        setPuzzleZoneValue(props.zoneID || "select zone");
        setClueZoneValue(props.zoneID || "select zone");
        setHintZoneValue(props.zoneID || "select zone");
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PuzzleZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
            className={"city-dropdown"}
            paddingTop={"3px"}
            value={puzzleZoneValue}
            onChange={(e) => setPuzzleZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.isArray(props.visibleGame.gamePlayZone) && props.visibleGame.gamePlayZone?.map((zone: any) => (
                <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ClueZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={clueZoneValue}
                onChange={(e) => setClueZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.visibleGame.gamePlayZone?.map((zone:any) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HintZoneDropDown = (props: {visibleGame: any}) => {
        return (
            <SelectField
                label={""}
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={hintZoneValue}
                onChange={(e) => setHintZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.visibleGame.gamePlayZone?.map((zone:any) => (
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
                    <option key={city.id} value={city.cityName || ""}>{city.cityName}</option>
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
                    <TableBody key={'x'}>
                {Array.isArray(games) && games.map((game) => (
                    <TableRow key={game.id}>
                        {(gameVisible === "") &&
                        <>
                        <TableCell><Button gap="0.1rem" size="large"  className="plus-minus"  onClick={() => setGameVisibleFunction(game.id)}>+</Button>
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
                                    onClick={() => setGameVisibleFunction(game.id)}>edit</Button>
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
                                <Button gap="0.1rem" size="small" className="plus-minus" onClick={() => closeSingleGame()}>-</Button>
                                <Heading level={5} color="black" marginRight={"1rem"}>

                                    {game.gameName}:  </Heading>
                                <Button gap="0.1rem" marginRight="10px" size="small"
                                        onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>

                                <Button gap="0.1rem" size="small" onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>

                            </Flex>
                            <Table
                                highlightOnHover={true}
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
                            <TableRow className={"zones"}>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Zones:</Heading>
                                        <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                                                onClick={() => handleZoneForm({"gameID": game.id, "zoneID": "", "action": "add"})}>
                                            <span style={{fontSize: "20px"}}>+</span> add zone</Button>

                                    </Flex>

                                   <Table
                                            highlightOnHover={true}
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
                                                {Array.isArray(game.gamePlayZone) && game.gamePlayZone?.map((zone) => (
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
                                                                    onClick={() => handleZoneForm({"gameID": game.id, "zoneID": zone.id, "action": "edit", "gameDesigner": game.gameDesigner || ''})}>edit</Button>
                                                            <Button gap="0.1rem" size="small"
                                                                    onClick={() => handlePuzzleForm({"puzzleID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> puzzle</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleHintForm({"hintID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> hint</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleClueForm({"clueID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> clue</Button>
                                                            {/* got rid of "setGameVisibleFunction with text "set zone" ... could be to just look at one zone at a time */}
                                                            <Button  gap="0.1rem" size="small" color={"green"} onClick={() => setAllZoneValue({"zoneID":zone.id})}>set zone</Button>

                                                            <Button  gap="0.1rem" size="small" color={"red"}
                                                                     onClick={() => deleteZone({"zoneID": zone.id, "gameZoneName": zone.gameZoneName})}>x</Button>
                                                        </TableCell>


                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>


                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Puzzles</Heading>
                                        <PuzzleZoneDropDown visibleGame={game}/>
                                    </Flex>

                                 <>
                                     {/* got a lot of errors where I just tried to map the arrays but changed to this way because:
                                        LazyLoader types need to be verified as arrays before using array methods.*/

                                     Array.isArray(game.gamePuzzle) && game.gamePuzzle.map((puzzle) => (
                                            <View className={"border1"} key={puzzle.id}>
                                                <Table
                                                    highlightOnHover={true}
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
                                                                        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                             Array.isArray(puzzle.textField) && puzzle.textField?.map((textField: any) => (
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
                                        ))}</>

                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Flex>
                                <Heading level={4} color="black" >Clues</Heading><ClueZoneDropDown visibleGame={game}/>
                                </Flex>
                                <Table
                                    highlightOnHover={true}
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
                                 <TableBody>

                                    {Array.isArray(game.gameClue) && game.gameClue?.map((clue) => (
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
                                        </TableBody>



                                </Table>
                            </TableCell>
                        </TableRow>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Flex>
                                            <Heading level={4} color="black" >Hints</Heading><HintZoneDropDown visibleGame={game}/>
                                        </Flex>
                                        <Table
                                            highlightOnHover={true}
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
                                                    <TableBody>
                                                        {Array.isArray(game.gameHint) && game.gameHint?.map((hint) => (
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