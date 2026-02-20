import {useContext, useEffect, useState, useCallback, useMemo} from "react"
import {
    View
} from '@aws-amplify/ui-react';
import {useNavigate} from "react-router-dom";
import { format } from 'date-fns'
import {
    goHomeQuit,
    removeLocalStorage,
    keyID
} from "../components/helper";

import {ModalSlideFromBottom, ModalWinner, ModalPuzzle, ModalMap} from "../components/Modals";
import { dataService } from "../services/dataService";
import type { Schema } from "../../amplify/data/resource";
import GameClue from "../components/game/GameClue";
import GameHint from "../components/game/GameHint";
import GamePuzzle from "../components/game/GamePuzzle";
import ModalPuzzleContent from "../components/game/ModalPuzzleContent";
import {MapGame} from "../components/Map";
import Winner from "../components/game/Winner";
import {MyAuthContext} from "../MyContext";
import NotAvailable from "../components/NotAvailable";
import Help from "../components/game/Help";
import "../assets/css/game.css";

import ZoneIconLight from "../assets/icons/zone-FFFFFF.svg?react";
import ZoneIconDark from "../assets/icons/zone.svg?react";
import {createModalContent} from "../utils/modalHelpers.ts";

type Game = Schema["Game"]["type"];
type GameHint = Schema["GameHint"]["type"];
type GamePlayZone = Schema["GamePlayZone"]["type"];
type GameClue = Schema["GameClue"]["type"];
type GamePuzzle = Schema["GamePuzzle"]["type"];
type TextField = Schema["TextField"]["type"];

interface GamePuzzleWithTextFields extends Omit<GamePuzzle, 'textField'> {
    textField: TextField[];
}

interface PuzzleDetails {
    puzzleID: string;
    textFields: TextField[];
    puzzleName?: string;
    puzzleClueText?: string;
}

interface ModalContentMap {
    open: boolean;
    content: string;
}

const initialStatePuzzleDetails: PuzzleDetails = {
    puzzleID: '',
    textFields: [],
    puzzleName: '',
    puzzleClueText: '',
};

export default function Game() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("Game must be used within MyAuthContext.Provider");
    const { isChecked, setIsChecked, authStatus, setModalContent, modalContent } = context;

    const [modalContentMap, setModalContentMap] = useState<ModalContentMap>({open: false, content: ""});
    const [game, setGame] = useState<Game | null>(null);


    const [playZone, setPlayZone] = useState<GamePlayZone[]>([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [gameClueArray, setGameClueArray] = useState<GameClue[]>([]);
    const [gamePuzzleArray, setGamePuzzleArray] = useState<GamePuzzleWithTextFields[]>([]);
    const [gameHintArray, setGameHintArray] = useState<GameHint[]>([]);

    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState<Record<string, string>>({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState<Record<string, string>>({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState<Record<string, boolean>>({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState<Record<string, boolean>>({});

    const [isGoHomeQuitVisible, setIsGoHomeQuitVisible] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const [alertText, setAlertText] = useState('');

    const [modalPuzzleContent, setModalPuzzleContent] = useState({show:false, content:""});

    const [gameHintVisible, setGameHintVisible] = useState<Record<string, boolean>>({});
    const [gameClueVisible, setGameClueVisible] = useState<Record<string, boolean>>({});
    const [gameTimeHint, setGameTimeHint] = useState(0);
    const [gameTimeTotal, setGameTimeTotal] = useState(0);
    const [gameStatsID, setGameStatsID] = useState('');
    const [gameScoreID, setGameScoreID] = useState('');
    const [,setGameID] = useState('');
    const [gameComplete, setGameComplete] = useState(false);
    const [showWinner, setShowWinner] = useState(false);
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
                console.log("gamePuzzleSolved: " + localStorage.getItem("gamePuzzleSolved"));
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
            /* end check */
        } else {
            console.log("loading game: get GameID: " + localStorage.getItem("gameID"));
            console.log("loading game: get GameStatsID: " + localStorage.getItem("gameStatsID"));
            /* get gamescoreid */
            const gameID = localStorage.getItem("gameID");
            const gameStatsID = localStorage.getItem("gameStatsID");
            const filter = {
                gameStatsID: {
                    eq: gameStatsID || undefined
                },
                gameID: {
                    eq: gameID || undefined
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
                    filter,
                    selectionSet: ['id', 'createdAt']
                });
                
                if (gamesScoreData && gamesScoreData.length > 0) {
                    // Sort by createdAt descending to get most recent
                    const sortedScores = gamesScoreData.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    localStorage.setItem("gameScoreID", sortedScores[0].id);
                }
            } catch (err) {
                console.log('error createGameScore..', err)
            }
            setGameID(localStorage.getItem("gameID") || '');
            setGameStatsID(localStorage.getItem("gameStatsID") || '');
            setGameScoreID(localStorage.getItem("gameScoreID") || '');
            const startDate = new Date();
            setRealTimeStart(startDate);
            localStorage.setItem("realTimeStart", startDate.toString());
        }
        /* end setup based on localStorage or initial game */
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
                    selectionSet: ['id', 'gameID', 'gamePlayZoneID', 'puzzleName', 'puzzleImage', 'puzzleClueText', 'order', 'disabled', 'textField.*']
                });
                
                /* set up Play Zones: */
                if (gamePlayZones && gamePlayZones.length > 0) {
                    const gameZoneArray = gamePlayZones.sort((a, b) => {
                        return (a.order || 0) - (b.order || 0);
                    });
                    setPlayZone(gameZoneArray);
                    setZoneVisibleFunction(gameZoneArray[0].id, gameZoneArray[0].gameZoneName || '');
                    console.log("gamePlayZones.length: " + gamePlayZones.length);
                }
                
                /* set up game hints: */
                if (gameHints && gameHints.length > 0) {
                    const gameHintArrayTemp = gameHints.sort((a, b) => {
                        return (a.order || 0) - (b.order || 0);
                    });
                    setGameHintArray(gameHintArrayTemp);
                    console.log("gameHintArray.length: " + gameHintArrayTemp.length);
                }
                
                /* set up game clues: */
                if (gameClues && gameClues.length > 0) {
                    const gameClueArrayTemp = gameClues.sort((a, b) => {
                            return (a.order || 0) - (b.order || 0);
                        });
                    setGameClueArray(gameClueArrayTemp);
                    console.log("gameClueArray.length: " + gameClueArrayTemp.length);
                }
                
                /* set up game Puzzle: */
                console.log("gamePuzzles.length: "  + (gamePuzzles?.length || 0));
                if (gamePuzzles && gamePuzzles.length > 0) {
                    console.log("setGamePuzzleArray: " + JSON.stringify(gamePuzzles));
                    const gamePuzzleArrayTemp = gamePuzzles.sort((a, b) => {
                            return (a.order || 0) - (b.order || 0);
                        });
                    setGamePuzzleArray(gamePuzzleArrayTemp as unknown as GamePuzzleWithTextFields[]);
                    /* only do this if gamePuzzleSolved is not in localStorage */
                    /*if (localStorage.getItem("gamePuzzleSolved")===null) {
                        console.log("gamePuzzles[0].id: " + gamePuzzles[0].id);
                        const gamePuzzleSolveID = gamePuzzles[0].id;
                        setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]: false});
                    }*/
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
            setShowWinner(true);
        }
    }, [gameComplete]);

    async function updateGameScoreFunction() {
        if (!gameComplete) return;
        console.log("updateGameScore:  " + gameTimeHint);
        const startDate = new Date(realTimeStart || new Date());
        // Do your operations to calculate time
        const endDate   = new Date();
        localStorage.setItem("realTimeEnd", endDate.toString());
        const minutes = (endDate.getTime() - startDate.getTime()) / 60000;
        const GameTimeTotal = Number(minutes + gameTimeHint).toFixed(2);
        console.log("GameTimeTotal: " + GameTimeTotal);
        setGameTimeTotal(Number(GameTimeTotal));

        try {
            const client = dataService.getAuthClient();
            console.log("Updating GameScore with ID:", gameScoreID);
            console.log("Update data:", {
                gameTotalTime: Number(GameTimeTotal),
                gameHintTime: gameTimeHint,
                completed: true
            });
            
            const result = await client.models.GameScore.update({
                id: gameScoreID,
                gameTotalTime: Number(GameTimeTotal),
                gameHintTime: gameTimeHint,
                completed: true
            });
            
            console.log("GameScore update result:", result);
            
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


/*    function setAlertTextFunction(alertText: string) {
        setIsAlertVisible(true);
        setAlertText(alertText);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }
    */

    const setZoneVisibleFunction = useCallback((zoneID: string, zoneName: string) => {
        setZoneVisible(zoneID);
        setZoneName(zoneName);
    }, []);

    const [gamePuzzleDetails, setGamePuzzleDetails] = useState<PuzzleDetails>(initialStatePuzzleDetails);

    const missionStyle = useMemo(() => ({
        textAlign: "center" as const,
        fontWeight: "bold" as const,
        fontSize: "1.2em"
    }), []);

    /*function DangerouslySetInnerHTMLSanitized(htmlContent: string) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }*/
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!game) {
        return <View>Loading...</View>;
    }
    {/* Game UI */}
    if (gameComplete) {
        return (
            <Winner game={game} gameScoreID={gameScoreID} gameTimeTotal={gameTimeTotal} gameTimeHint={gameTimeHint}/>
        )
    }
    if (game && !gameComplete){
    return (
            <View position="relative">
                {authStatus !== 'authenticated' ? (
                    <NotAvailable message="Game is not available" authStatus={authStatus} />
                ) : (
                    <>
                    <View className={isChecked ? "live game-container background-dark" : "live game-container background-light"}>
                        <div style={missionStyle}>
                            Mission: <span className="mission">{game.gameGoals}</span>
                        </div>
                        <div className="button-bar">
                            <button className={isChecked ? "button background-dark " : "button background-light "} onClick={() => setModalContentMap({
                                open: true,
                                content: "Map"
                            })}>
                                Zone Map
                            </button>
                            {!isDarkMode && <button className={isChecked ? "button background-dark " : "button background-light "} onClick={() => {
                                if (setIsChecked) {
                                    setIsChecked(!isChecked);
                                }
                            }}>{isChecked? "Switch to Light" : "Switch to Dark"}
                            </button>}
                            <button className={isChecked ? "button background-dark " : "button background-light "} onClick={() =>
                                setModalContent(createModalContent({
                                    open: true,
                                    content: "Help"
                                }))}>Help</button>
                            <button className={isChecked ? "button background-dark " : "button background-light "}
                                    onClick={() => {
                                        setIsGoHomeQuitVisible(true)
                                    }}>Quit
                            </button>
                        </div>
                        <div className="puzzle-solved">
                            Puzzles Solved? <span>{(gamePuzzleSolved && Object.keys(gamePuzzleSolved).length) ? Object.keys(gamePuzzleSolved).length : 0}</span>/<span>{gamePuzzleArray.length}</span>

                        </div>
                        <View aria-label="Time" className="time time-change">
                            <View className="small">time
                                started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null} | hint
                                time: {gameTimeHint}</View>
                        </View>
                        <View className="top-bar top-bar-change">
                            <h4>Select Zone:</h4>
                            <div className="game-item-holder">
                                {playZone.map((zone, index) => (
                                    <View
                                        className={(zoneVisible == zone.id) ? "zone-border zone-icon-container" : "zone-icon-container"}
                                        key={zone.id} aria-label={zone.id}
                                        onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName || '')}>
                                        {isChecked ? <ZoneIconLight height={30} width={30}/> :
                                            <ZoneIconDark height={30} width={30}/>}
                                        <View className={"zone-text"}>zone {index + 1}</View>
                                    </View>
                                ))}
                            </div>
                        </View>
                        <div className="zone-name">You are at {zoneName}</div>
                        <View className="play-area">
                            {playZone.map((zone) => (
                                <div aria-label={keyID(zone.id, "zone")} key={keyID(zone.id, "zone")}
                                     className={(zoneVisible == zone.id) ? "show" : "hide"}>
                                    <div className="zone-description">description: <br/>{zone.gameZoneDescription}</div>
                                    <div>
                                        <img src={zone.gameZoneImage || undefined}/>
                                    </div>
                                </div>
                            ))}
                            <h4>Select Puzzle:</h4>
                            <View className={"game-item-holder"}>

                                {gamePuzzleArray.map((puzzle, index) => (
                                    <GamePuzzle puzzle={puzzle}
                                                zoneVisible={zoneVisible}
                                                gamePuzzleDetails={gamePuzzleDetails}
                                                setGamePuzzleDetails={setGamePuzzleDetails}
                                                index={index}
                                                gamePuzzleSolved={gamePuzzleSolved}
                                                gamePuzzleGuess={gamePuzzleGuess}
                                                gamePuzzleAnswer={gamePuzzleAnswer}
                                                gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                                setModalPuzzleContent={setModalPuzzleContent}
                                                key={puzzle.id}/>
                                ))}

                            </View>
                            <ModalPuzzle
                                modalPuzzleContent={modalPuzzleContent}
                                setModalPuzzleContent={setModalPuzzleContent}
                                gamePuzzleDetails={gamePuzzleDetails}>
                                <ModalPuzzleContent
                                    gamePuzzleDetails={gamePuzzleDetails}
                                    gamePuzzleGuess={gamePuzzleGuess}
                                    setGamePuzzleGuess={setGamePuzzleGuess}
                                    setGamePuzzleAnswer={setGamePuzzleAnswer}
                                    gamePuzzleSolved={gamePuzzleSolved}
                                    setGamePuzzleSolved={setGamePuzzleSolved}
                                    gamePuzzleAnswer={gamePuzzleAnswer}
                                    gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                    gamePuzzleArray={gamePuzzleArray as unknown as GamePuzzle[]}
                                    setModalPuzzleContent={setModalPuzzleContent}
                                    setGamePuzzleAnswerCorrect={setGamePuzzleAnswerCorrect}
                                    setGameComplete={setGameComplete}
                                />
                            </ModalPuzzle>
                            <h4>Select Clue:</h4>
                            <View className={"game-item-holder"}>
                                {gameClueArray.map((clue, index) => (
                                    <GameClue clue={clue}
                                              zoneVisible={zoneVisible}
                                              setGameClueVisible={setGameClueVisible}
                                              gameClueVisible={gameClueVisible}
                                              index={index}
                                              key={clue.id}/>
                                ))}
                            </View>

                            <h4>Select Hint:</h4>
                            <View className={"game-item-holder"}>
                                {gameHintArray.map((hint, index) => (
                                    <GameHint hint={hint}
                                              zoneVisible={zoneVisible}
                                              setGameTimeHint={setGameTimeHint}
                                              setGameHintVisible={setGameHintVisible}
                                              gameHintVisible={gameHintVisible}
                                              index={index}
                                              key={hint.id}
                                    />
                                ))}
                            </View>
                        </View>
                        {/* end play area */}

                    </View> {/* end game-container */}

                        <ModalMap isOpen={modalContentMap.open} setModalContentMap={setModalContentMap}>
                            {(modalContentMap.content === "Map") && <MapGame game={game} gameIntro={false}/>}
                        </ModalMap>
                        <ModalSlideFromBottom isOpen={modalContent.open}>
                            {(modalContent.content == "Help") && <Help/>}
                        </ModalSlideFromBottom>
                        <ModalWinner showWinner={showWinner} setShowWinner={setShowWinner}>
                            {(gameComplete) &&
                                <Winner game={game} gameScoreID={gameScoreID} gameTimeTotal={gameTimeTotal} gameTimeHint={gameTimeHint}/>}
                        </ModalWinner>

                        <View className={isAlertVisible ? "alert-container show" : "hide"}>
                            <div className='alert-inner'>{alertText}</div>
                        </View>
                        <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                            <div className='alert-inner'>Do You Really Want To Quit?<br/>
                                <button className="button button-small quit-button-alert "
                                        onClick={() => {
                                            setIsGoHomeQuitVisible(false);
                                            goHomeQuit(navigate)
                                        }}>Yes, I Want Quit</button>
                                <button className="button button-small quit-button-alert"
                                        onClick={() => {
                                            setIsGoHomeQuitVisible(false)
                                        }}>No, I Want to Play</button>
                            </div>
                        </View>

                    </>
                )}
            </View>
    )}}