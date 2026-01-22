import React, {useEffect, useState} from "react"
import {
    Button,
    View,
    Image,
    Flex, useAuthenticator
} from '@aws-amplify/ui-react';
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import { format } from 'date-fns'
import {
    setGameNotesFunction,
    goHomeQuit,
    removeLocalStorage,
    keyID
} from "../components/helper";

import { ModalSlideFromBottom, ReactModalWinner, ModalClue, ModalPuzzle } from "../components/Modals";
import { dataService } from "../services/dataService";
import type { Schema } from "../../amplify/data/resource";
import GameClue from "../components/game/GameClue";
import {GamePuzzle, ModalPuzzleContent} from "../components/game/GamePuzzle";
import Hints from "../components/game/Hints";
import {MapGame} from "../components/game/Map";
import Winner from "../components/game/Winner";
import Help from "../components/game/Help";
import zoneIcon from "../assets/noun-zone-3097481-FFFFFF.svg";
import {MyGameContext} from "../MyContext";

type Game = Schema["Game"]["type"];
type GameHint = Schema["GameHint"]["type"];
type GamePlayZone = Schema["GamePlayZone"]["type"];
type GameClue = Schema["GameClue"]["type"];
type GamePuzzle = Schema["GamePuzzle"]["type"];
type GameScore = Schema["GameScore"]["type"];
type GameStats = Schema["GameStats"]["type"];

interface ClueDetails {
    gameClueName: string;
    gameClueText: string;
    gameClueImage: string;
    gameClueID?: string;
}

interface PuzzleDetails {
    puzzleID: string;
    winGame: boolean;
    textFields: any[];
}

interface CluesArrayItem {
    gameClueName: string;
    gameClueText: string;
    gameClueID: string;
    gameClueImage: string;
}

export default function Game() {
    const location = useLocation();
    const { authStatus } = useAuthenticator((context) => [
        context.authStatus])
    /* dark / light */
    const [isChecked, setIsChecked] = useState(true);

    const [game, setGame] = useState<Game | null>(null);
    const [gameHint, setGameHint] = useState<GameHint[]>([]);

    const [playZone, setPlayZone] = useState<GamePlayZone[]>([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [clues, setClues] = useState("");
    const [cluesArray, setCluesArray] = useState<CluesArrayItem[]>([]);
    const [gameClues, setGameClues] = useState<GameClue[]>([]);
    const [gamePuzzleArray, setGamePuzzleArray] = useState<GamePuzzle[]>([]);

    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState<Record<string, string>>({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState<Record<string, string>>({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState<Record<string, boolean>>({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState<Record<string, boolean>>({});

    const [isGoHomeQuitVisible, setIsGoHomeQuitVisible] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');

    const [modalContent, setModalContent] = useState({open:false, content:""});
    const [modalClueContent, setModalClueContent] = useState({show:false, content:""});
    const [modalPuzzleContent, setModalPuzzleContent] = useState({show:false, content:""});

    const [gameHintVisible, setGameHintVisible] = useState<Record<string, boolean>>({});
    const [gameNotes,setGameNotes] = useState('');
    const [gameTimeHint, setGameTimeHint] = useState(0);
    const [gameTimeTotal, setGameTimeTotal] = useState(0);
    const [gameStatsID, setGameStatsID] = useState('');
    const [gameScoreID, setGameScoreID] = useState('');
    const [gameID, setGameID] = useState('');
    const [gameComplete, setGameComplete] = useState(false);
    const [realTimeStart, setRealTimeStart] = useState<Date | null>(null);
    /*****/

    const navigate = useNavigate();

    /* get gamestats and set localstorage */
    async function setGamePlayFunction() {
        console.log("setGamePlayFunction - only on mount");
        //* check if already playing */
        if (localStorage.getItem("realTimeStart")) {
            /* have already started game - user refreshed (or something) and wants to continue */
            setIsAlertVisible(true);
            setAlertText('resuming game');
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 3000);
            setGameNotes(localStorage.getItem("gameNotes") || '');
            const storedRealTimeStart = localStorage.getItem("realTimeStart");
            if (storedRealTimeStart) {
                setRealTimeStart(new Date(storedRealTimeStart));
            }
            setGameScoreID(localStorage.getItem("gameScoreID") || '');
            if (localStorage.getItem("gameTimeHint")!=null) {
                setGameTimeHint(Number(localStorage.getItem('gameTimeHint')));
            }
            if (localStorage.getItem("gameHintVisible")!=null) {
                setGameHintVisible(JSON.parse(localStorage.getItem("gameHintVisible") || '{}'));
            }
            if (localStorage.getItem("gamePuzzleSolved")!=null) {
                setGamePuzzleSolved(JSON.parse(localStorage.getItem("gamePuzzleSolved") || '{}'));
            }
            if (localStorage.getItem("gamePuzzleGuess")!=null) {
                setGamePuzzleGuess(JSON.parse(localStorage.getItem("gamePuzzleGuess") || '{}'));
            }
            if (localStorage.getItem("gamePuzzleAnswer")!=null) {
                setGamePuzzleAnswer(JSON.parse(localStorage.getItem("gamePuzzleAnswer") || '{}'));
            }
            if (localStorage.getItem("gamePuzzleAnswerCorrect")!=null) {
                setGamePuzzleAnswerCorrect(JSON.parse(localStorage.getItem("gamePuzzleAnswerCorrect") || '{}'));
            }
            if (localStorage.getItem("cluesArray")!=null) {
                setCluesArray(JSON.parse(localStorage.getItem("cluesArray") || '[]'));
            }
            /* end check */
        } else {
            console.log("loading game: get GameID: " + localStorage.getItem("gameID"));
            console.log("loading game: get GameStatsID: " + localStorage.getItem("gameStatsID"));
            /* get gamescoreid */
            let filter = {
                gameID: {
                    eq: localStorage.getItem("gameID")
                },
                gameTotalTime: {
                    eq: 0
                },
                gameHintTime: {
                    eq: 0
                },
                completed: {
                    eq: false
                },
                disabled: {
                    eq: false
                }
            };
            try {
                const client = dataService.getClient();
                const { data: gamesScoreData } = await client.models.GameScore.list({
                    filter: filter as any,
                    selectionSet: ['id']
                });
                
                if (gamesScoreData && gamesScoreData.length > 0) {
                    localStorage.setItem("gameScoreID", gamesScoreData[0].id);
                }
            } catch (err) {
                console.log('error createGameScore..', err)
            }
            setGameID(localStorage.getItem("gameID") || '');
            setGameStatsID(localStorage.getItem("gameStatsID") || '');
            setGameScoreID(localStorage.getItem("gameScoreID") || '');
            let startDate = new Date();
            setRealTimeStart(startDate);
            localStorage.setItem("realTimeStart", startDate.toString());
        }
        /* get game details */
        try {
            const client = dataService.getClient();
            const { data: gamesFromAPI } = await client.models.Game.get({
                id: localStorage.getItem("gameID") || ''
            });
            
            if (gamesFromAPI) {
                setGame(gamesFromAPI);
                console.log("gamesFromAPI (JSON.stringify): " +  JSON.stringify(gamesFromAPI));
                console.log("getGameDetails initial: " + gamesFromAPI.gameName);
                
                // Fetch related data separately
                const gameId = localStorage.getItem("gameID") || '';
                
                // Fetch game play zones
                const { data: gamePlayZones } = await client.models.GamePlayZone.list({
                    filter: { gameID: { eq: gameId } }
                });
                
                // Fetch game hints
                const { data: gameHints } = await client.models.GameHint.list({
                    filter: { gameID: { eq: gameId } }
                });
                
                // Fetch game clues
                const { data: gameClues } = await client.models.GameClue.list({
                    filter: { gameID: { eq: gameId } }
                });
                
                // Fetch game puzzles with text fields
                const { data: gamePuzzles } = await client.models.GamePuzzle.list({
                    filter: { gameID: { eq: gameId } },
                    selectionSet: ['id', 'gameID', 'gamePlayZoneID', 'puzzlePosition', 'puzzleName', 'puzzleImage', 'puzzleImageOpen', 'puzzleImageSolved', 'puzzleClueRevealed', 'puzzleClueText', 'puzzleToolRevealed', 'puzzleToolNeeded', 'winGame', 'winGameImage', 'winGameMessage', 'order', 'disabled', 'textField.id', 'textField.puzzleID', 'textField.name', 'textField.label', 'textField.answer', 'textField.order', 'textField.disabled']
                });
                
                /* set up Play Zones: */
                if (gamePlayZones && gamePlayZones.length > 0) {
                    let gameZoneArray = gamePlayZones.sort((a, b) => {
                        return (a.order || 0) - (b.order || 0);
                    });
                    setPlayZone(gameZoneArray);
                    setZoneVisibleFunction(gameZoneArray[0].id, gameZoneArray[0].gameZoneName || '');
                    console.log("gamePlayZones.length: " + gamePlayZones.length);
                }
                
                /* set up game hints: */
                if (gameHints && gameHints.length > 0) {
                    let gameHintArray = gameHints.sort((a, b) => {
                        return (a.order || 0) - (b.order || 0);
                    });
                    setGameHint(gameHintArray);
                    console.log("gameHints.length: " + gameHints.length);
                }
                
                /* set up game clues: */
                if (gameClues && gameClues.length > 0) {
                    let gameClueArray = gameClues.sort((a, b) => {
                            return (a.order || 0) - (b.order || 0);
                        });
                    setGameClues(gameClueArray);
                    console.log("gameClues.length: " + gameClues.length);
                }
                
                /* set up game Puzzle: */
                console.log("gamePuzzles.length: "  + (gamePuzzles?.length || 0));
                if (gamePuzzles && gamePuzzles.length > 0) {
                    console.log("setGamePuzzleArray: " + JSON.stringify(gamePuzzles));
                    let gamePuzzleArrayTest = gamePuzzles.sort((a, b) => {
                            return (a.order || 0) - (b.order || 0);
                        });
                    setGamePuzzleArray(gamePuzzleArrayTest);
                    console.log("gamePuzzles[0].id: " + gamePuzzles[0].id);
                    let gamePuzzleSolveID = gamePuzzles[0].id;
                    setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]:false});
                }
            }
        } catch (err) {
            console.log('error fetching getGame', err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***: setGamePlayFunction (only on mount)");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        setGamePlayFunction();
    }, []);

    useEffect(() => {
        console.log("***useEffect***: updateGameScoreFunction");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        if (gameComplete) {
            updateGameScoreFunction();
        }
    }, [gameComplete]);

    async function updateGameScoreFunction() {
        if (!gameComplete) return;
        
        console.log("updateGameScore:  " + gameTimeHint);
        let startDate = new Date(realTimeStart || new Date());
        // Do your operations to calculate time
        let endDate   = new Date();
        localStorage.setItem("realTimeEnd", endDate.toString());
        let minutes = (endDate.getTime() - startDate.getTime()) / 60000;
        let GameTimeTotal = Number(minutes + gameTimeHint).toFixed(2);
        console.log("GameTimeTotal: " + GameTimeTotal);
        setGameTimeTotal(Number(GameTimeTotal));

        try {
            const client = dataService.getAuthClient();
            await client.models.GameScore.update({
                id: gameScoreID,
                gameTotalTime: Number(GameTimeTotal),
                gameHintTime: gameTimeHint,
                completed: true
            });
            
            const gameStatsValues = {
                waiverSigned: true, completed: true
            }
            
            await client.models.GameStats.update({
                id: gameStatsID,
                gameStates: JSON.stringify(gameStatsValues),
            });

            removeLocalStorage();

            setTimeout(() => {
                //goHomeQuit(navigate);
            }, 15000);
            console.log("winGameFunction");
        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }

    function setCluesFunction(gameClueName: string, gameClueText: string, gameClueID: string, gameClueImage: string) {
        setAlertText("clue added to notes");
        setIsAlertVisible(true);
        console.log("setCluesFunction");
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        let clueTemp = "<strong>" + gameClueName + " </strong> ==> " +
            gameClueText + " <br />";

            let cluesArrayObject: CluesArrayItem = {
                gameClueName: gameClueName,
                gameClueText: gameClueText,
                gameClueID: gameClueID,
                gameClueImage: gameClueImage,
            };
            let cluesArrayTemp = [...cluesArray];
            cluesArrayTemp.push(cluesArrayObject);
            console.log("json cluesArrayTemp Z2: " + JSON.stringify(cluesArrayTemp))
            setCluesArray(cluesArrayTemp);
        setClues(clues + clueTemp);
        localStorage.setItem("clues",clues + clueTemp);
        localStorage.setItem("cluesArray",JSON.stringify(cluesArrayTemp));
    }
    
    function setCluesArrayRemoveFunction(index: number) {
        console.log("setCluesArrayFunction");
        const cluesArrayTemp = [...cluesArray];
        console.log("json cluesArrayTemp 1: " + JSON.stringify(cluesArrayTemp))
        const x = cluesArrayTemp.splice(index,1);
        console.log("json cluesArrayTemp 2: " + JSON.stringify(cluesArrayTemp))
        localStorage.setItem("cluesArray",JSON.stringify(cluesArrayTemp));
        setCluesArray(cluesArrayTemp);
    }

    function setAlertTextFunction(alertText: string) {
        setIsAlertVisible(true);
        setAlertText(alertText);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    function setZoneVisibleFunction(zoneID: string, zoneName: string) {
        setZoneVisible(zoneID);
        setZoneName(zoneName);
        setAlertTextFunction("Clues reference things near " + zoneName);
    }

    const backgroundImage = (src: string) => (
        "url("+ src + ")");

    const initialStateClueDetails: ClueDetails = {
        gameClueName: '',
        gameClueText: '',
        gameClueImage: ''
    };
    const [clueDetails, setClueDetails] = useState<ClueDetails>(initialStateClueDetails);
    const initialStatePuzzleDetails: PuzzleDetails = {
        puzzleID: '',
        winGame: false,
        textFields: [],
    };
    const [puzzleDetails, setPuzzleDetails] = useState<PuzzleDetails>(initialStatePuzzleDetails);

    Modal.setAppElement('#modal');

    function DangerouslySetInnerHTMLSanitized(htmlContent: string) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }
    
    if (!game) {
        return <View>Loading...</View>;
    }
    
    return (
        <MyGameContext.Provider value={{
            isChecked,
            navigate,
            gameScoreID,
            setGamePuzzleGuess,
            setGamePuzzleAnswer,
            setGamePuzzleAnswerCorrect,
            setGamePuzzleSolved,
            gamePuzzleArray,
            setModalPuzzleContent,
            setClueDetails,
            setModalClueContent,
            setModalContent,
            setGameComplete
        }}>
            <View position="relative">
                {(authStatus != 'authenticated') | (authStatus === "configuring") ? (
                    <View>
                        {authStatus === "configuring" ?
                            (<View>Loading</View>):(
                                <View>
                                    <View paddingTop="30px" textAlign={"center"}>Game is not available</View>
                                    <Flex justifyContent="center">
                                        <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                                    </Flex>
                                </View>
                            )}
                    </View>
                ) : (
                <>
                <View className={isChecked ? "game-container background-dark" : "game-container light"}>
                    <View className={"logo-top"}>EscapeOut.Games</View>
                    <View className="top-bar top-bar-change">

                        <Flex className="zone-holder zone-holder-change"
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              alignContent="center"
                              wrap="nowrap"
                              gap="1rem">
                            {playZone.map((zone, index) => (
                                <View
                                    className={(zoneVisible == zone.id) ? "zone-border zone-icon-container" : "zone-icon-container"}
                                    key={zone.id} aria-label={zone.id}
                                    onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName || '')}>
                                    <Image height="40px" width="40px" src={zoneIcon} alt="zone icon"/>
                                    <View className={"zone-text"}>zone {index + 1}</View>
                                </View>
                            ))}
                        </Flex>
                    </View>
                    <View className="play-area play-area-change">
                        <View className="image-mask image-mask-change"></View>
                        {playZone.map((zone, index) => (
                            <View aria-label={keyID(zone.id, "zone")} key={keyID(zone.id, "zone")}
                                  className={(zoneVisible == zone.id) ? "image-holder image-holder-change show" : "hide"}
                                  style={{backgroundImage: backgroundImage(zone.gameZoneImage || '')}}>
                            </View>
                        ))}
                        <View className={"game-container-top"}>
                            {zoneName}
                        </View>
                        <View className={"clue-sidebar"}>
                            {gameClues.map((clue, index) => (
                                <GameClue clue={clue}
                                          zoneVisible={zoneVisible}
                                          index={index}
                                          setModalClueContent={setModalClueContent}
                                          setClueDetails={setClueDetails}
                                          key={clue.id}/>
                            ))}
                        </View>
                        <ModalClue
                            modalClueContent={modalClueContent}
                            setModalClueContent={setModalClueContent}
                            clueDetails={clueDetails}
                            setCluesFunction={setCluesFunction}>
                            <>
                            <View
                                dangerouslySetInnerHTML={{__html: DangerouslySetInnerHTMLSanitized(clueDetails.gameClueText)}}
                                paddingTop="10px"></View>
                            {(clueDetails.gameClueImage != "" && clueDetails.gameClueImage != null) &&
                            <Image src={clueDetails.gameClueImage}/>}</>
                        </ModalClue>
                        <View className={"puzzle-sidebar"}>

                            {gamePuzzleArray.map((puzzle, index) => (
                                <GamePuzzle puzzle={puzzle}
                                            zoneVisible={zoneVisible}
                                            index={index}
                                            setPuzzleDetails={setPuzzleDetails}
                                            gamePuzzleSolved={gamePuzzleSolved}
                                            gamePuzzleGuess={gamePuzzleGuess}
                                            gamePuzzleAnswer={gamePuzzleAnswer}
                                            gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                            setClueDetails={setClueDetails}
                                            key={puzzle.id}/>
                            ))}

                        </View>
                        <ModalPuzzle
                            modalPuzzleContent={modalPuzzleContent}
                            setModalPuzzleContent={setModalPuzzleContent}
                            puzzleDetails={puzzleDetails}>
                            <ModalPuzzleContent
                                puzzleDetails={puzzleDetails}
                                gamePuzzleGuess={gamePuzzleGuess}
                                gamePuzzleSolved={gamePuzzleSolved}
                                gamePuzzleAnswer={gamePuzzleAnswer}
                                gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                setClueDetails={setClueDetails}
                                setModalClueContent={setModalClueContent}
                                updateGameScoreFunction={updateGameScoreFunction}
                            />
                        </ModalPuzzle>
                        <View className="right-side"></View>
                        <View className="game-container-bottom">
                        </View>
                    </View>
                    {/* end play area */}
                    <View className={"notes-area"}>
                        <View aria-label="Time" className="time time-change">
                            <View className="small">hint time: {gameTimeHint} mins | time
                                started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null}</View>
                        </View>
                    </View>
                </View> {/* end game-container */}


                <ModalSlideFromBottom modalContent={modalContent}>
                    {/*(modalContent.content == "Help") && <Help/>*/}
                    {(modalContent.content == "Help") &&
                    <Hints gameHint={gameHint} setGameTimeHint={setGameTimeHint} gameHintVisible={gameHintVisible}
                           setGameHintVisible={setGameHintVisible}
                           DangerouslySetInnerHTMLSanitized={DangerouslySetInnerHTMLSanitized}/>}
                    {(modalContent.content == "Map") && <MapGame playZone={playZone}/>}
                </ModalSlideFromBottom>
                <ReactModalWinner gameTimeTotal={gameTimeTotal}>
                    {(gameComplete) &&
                    <Winner game={game} gameTimeTotal={gameTimeTotal} gameTimeHint={gameTimeHint}/>}
                </ReactModalWinner>

                <View className={isAlertVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>{alertText}</div>
                </View>
                <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>Do You Really Want To Quit?<br/>
                        <Button marginRight={"10px"} className="button button-small quit-button-alert "
                                onClick={() => {
                                    setIsGoHomeQuitVisible(false);
                                    goHomeQuit(navigate)
                                }}>Yes, I Want Quit</Button>
                        <Button marginRight={"10px"} className="button button-small quit-button-alert"
                                onClick={() => {
                                    setIsGoHomeQuitVisible(false)
                                }}>No, I Want to Play</Button>
                    </div>
                </View>
                <View className={"game-bottom-bar-container"}>
                    <View className={"game-bottom-bar"}>
                        <Button className="quit-button dark"
                                onClick={() => setModalContent({
                                    open: true,
                                    content: "Map"
                                })}>
                            Zone Map</Button>
                        <Button className="quit-button dark"
                                onClick={() => setModalContent({
                                    open: true,
                                    content: "Help"
                                })}>
                            Help</Button>
                        <Button className={isChecked ? "quit-button dark " : "quit-button light "} onClick={() => {
                            setIsGoHomeQuitVisible(true)
                        }}>Quit</Button>
                    </View>
                </View>
                <View className={"logo"}>EscapeOut.Games</View>
                </>
             )}
            </View>
        </MyGameContext.Provider>
    )
}