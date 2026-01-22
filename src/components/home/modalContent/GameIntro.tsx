import {Button, Heading, View, TextField, Image} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers
} from "obscenity";
import {MyAuthContext} from "../../../MyContext";
import { dataService } from "../../../services/dataService";
import Waiver from "./Waiver";
import ExampleGame from "./ExampleGame";
import ExampleGame2 from "./ExampleGame2";
import ExampleGame3 from "./ExampleGame3";
import ExampleGame5 from "./ExampleGame5";
import ExampleGame4 from "./ExampleGame4";
import ExampleGame6 from "./ExampleGame6";
import DOMPurify from "dompurify";
import {ModalSlideFromBottom, ModalMap, ModalGameIntro} from "../../Modals";
import {Map} from "../../Map";
import type { GameDetailsVar } from "../../../types/game";

interface GameIntroProps {
    gameDetails: GameDetailsVar;
}

interface ModalContentState {
    show: boolean;
    content: string;
}

interface ModalContentMap {
    open: boolean;
    content: string;
}

export default function GameIntro(props: GameIntroProps) {
    const { gameDetails } = props;
    const navigate = useNavigate();
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { authStatus, email, gamesIDUserPlayed, gamesIDUser, setModalContent, setGameDetails } = context;
    
    /* Modal Content */
    const [modalContentGI, setModalContentGI] = useState<ModalContentState>({show:false, content:""});
    const [modalContentWaiver, setModalContentWaiver] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG, setModalContentEG] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG2, setModalContentEG2] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG3, setModalContentEG3] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG4, setModalContentEG4] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG5, setModalContentEG5] = useState<ModalContentState>({show:false, content:""});
    const [modalContentEG6, setModalContentEG6] = useState<ModalContentState>({show:false, content:""});
    const [modalContentMap, setModalContentMap] = useState<ModalContentMap>({open: false, content: ""});
    
    console.log('gameDetails.gameName: ' + gameDetails.gameName);
    
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const [numberOfPlayersError, setNumberOfPlayersError] = useState("");
    const [teamName, setTeamName] = useState("");
    const [hideWaiver, setHideWaiver] = useState(false);

    async function handlePlayGameIntro() {
        console.log("goToGame: " + gameDetails.gameName);
        
        if ((teamName !== "" && gameDetails.waiverSigned === gameDetails.gameID)) {
            setNumberOfPlayersError("");
            let firstTime = false;
            
            /* if first time create gameStats */
            if (gameDetails.numberOfTimes === 0) {
                firstTime = true;
                console.log("add game stat: (gameID): " + gameDetails.gameID);
                
                const gameStatsData = {
                    gameID: gameDetails.gameID,
                    userEmail: email || "",
                    gameName: gameDetails.gameName,
                    gameLocationCity: gameDetails.gameLocationCity,
                    gameStates: JSON.stringify({ waiverSigned: true }),
                    type: "gameStats",
                    disabled: false
                };
                
                try {
                    const client = await dataService.getAuthClient();
                    await client.models.GameStats.create(gameStatsData);
                } catch (err) {
                    console.log("error createGameStats..", err);
                }
            }
            
            /* get gameStatsID */
            try {
                const client = await dataService.getAuthClient();
                const gameStatsResponse = await client.models.GameStats.list({
                    filter: {
                        gameID: { eq: gameDetails.gameID },
                        userEmail: { eq: email || "" }
                    }
                });
                
                if (gameStatsResponse.data.length > 0) {
                    const gameStatsFromAPI = gameStatsResponse.data[0];
                    localStorage.setItem("gameStatsID", gameStatsFromAPI.id);
                } else {
                    setNumberOfPlayersError("Please Try Again - the system is not able to access database");
                    return;
                }
            } catch (err) {
                console.log("error getting gameStats..", err);
                return;
            }
            
            /* add new game score */
            const gameScoreData = {
                gameStatsID: localStorage.getItem("gameStatsID") || "",
                gameID: gameDetails.gameID,
                gameTotalTime: 0,
                gameHintTime: 0,
                teamName: teamName,
                completed: false,
                disabled: false,
                firstTime: firstTime
            };
            
            try {
                const client = await dataService.getAuthClient();
                await client.models.GameScore.create(gameScoreData);
                
                localStorage.setItem("gameID", gameDetails.gameID);
                localStorage.setItem("gameName", gameDetails.gameName);
                
                /* close modal */
                setModalContent({
                    open: false,
                    content: "",
                    id: "",
                    modalStyle: "",
                    action: "",
                    gameID: "",
                    zoneID: "",
                    updatedDB: false
                });
                
                /* navigate to game */
                if (gameDetails.gameName === "xxx") {
                    console.log("go to game: " + gameDetails.gameName + "page: /game");
                    navigate("/game");
                } else {
                    console.log(`go to game: ${gameDetails.gameName} page: /game`);
                    navigate("/game");
                }
            } catch (err) {
                console.log("error createGameScore..", err);
            }
        } else {
            console.log("show teamName error message: HandlePlayGameIntro");
            
            if (gameDetails.waiverSigned === gameDetails.gameID) {
                console.log("waiver signed (handlePlayGameIntro)");
                setNumberOfPlayersError("Please provide a Team Name");
            } else {
                /* go to waiver */
                setModalContent({
                    open: true,
                    content: "Waiver",
                    id: "",
                    modalClass: "",
                    modalClassOpen: "",
                    action: "",
                    gameID: "",
                    zoneID: "",
                    updatedDB: false
                });
            }
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        handleViewGameIntro();
    }, []);
    
    function handleViewWaiver() {
        console.log("handleViewWaiver");
        setModalContentWaiver({
            show: true,
            content: "Waiver"
        });
    }

    /**** don't need this */
    function handleExampleGame() {
        console.log("handleExampleGame");
        setModalContentEG({
            show: true,
            content: "Example Game"
        });
    }
    /***********************/

    function handleViewGameIntro() {
        console.log("handleViewGameIntro: " + teamName + " waiver?: " + gameDetails.waiverSigned);
        if ((teamName !== "" && gameDetails.waiverSigned === gameDetails.gameID)) {
            console.log("go to game start");
            setModalContentGI({
                show: true,
                content: "Game Intro"
            });

        } else {
            console.log("show teamName error message: HandlePlayGameIntro");
            
            if (gameDetails.waiverSigned === gameDetails.gameID) {
                console.log("waiver signed (handlePlayGameIntro)");
                setNumberOfPlayersError("Please provide a Team Name");
            } else {
                /* go to waiver */
                setModalContent({
                    open: true,
                    content: "Waiver",
                    id: "",
                    modalStyle: "game-details",
                    action: "",
                    gameID: "",
                    zoneID: "",
                    updatedDB: false
                });
            }
        }
    }

    function setTeamNameFunction(teamNameValue: string) {
        console.log("setTeamNameFunction: " + teamNameValue);
        /* check for obscenities */
        if (matcher.hasMatch(teamNameValue)) {
            setNumberOfPlayersError("The Team Name contains profanities. Please choose another.");
            setTeamName("");
        } else {
            setNumberOfPlayersError("");
            localStorage.setItem("teamName", teamNameValue);
            setTeamName(teamNameValue);
        }
    }

    function DangerouslySetInnerHTMLSanitized(htmlContent: string) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return sanitizedHtmlContent;
    }

    return (
        <>
            <View className={"end-paragraph"} textAlign={"center"}>
                <Heading level={5} textAlign={"center"} marginBottom="10px" paddingTop="10px">
                    {gameDetails.gameName}
                </Heading>
            </View>
            <View className={"end-paragraph"} textAlign={"center"}>
                <h3>All the Puzzles in all the Zones must be solved to complete the game.</h3>
            </View>
            <View className={"end-paragraph"} textAlign={"center"}>
                Generally Clues/Answers for Each Zone are within a 100 feet of Zone location.
            </View>
            <View className={"small end-paragraph"} textAlign={"center"}>
                <strong>You Have Signed Waiver</strong>:
                    <Button onClick={() => setHideWaiver(!hideWaiver)} variation={"link"}>
                        {hideWaiver ?
                            "View Waiver" :
                            "Close Waiver"
                        }
                    </Button>
                <div className={hideWaiver? "hide" : "waiver-container"}>
                    <Waiver gameDetails={gameDetails} setGameDetails={setGameDetails} gameIntro={true}/>
                </div>
            </View>
            <Heading level={6} textAlign={"center"} marginTop={"10px"} marginBottom={"5px"}>
                Start Playing when you are here:
            </Heading>
            <View className={"end-paragraph"} textAlign={"center"}>
                <Image alt={gameDetails.gameName} maxHeight="100px" src={gameDetails.gamePlayZoneImage1}/><br />
                <Button className="quit-button dark"
                        onClick={() => setModalContentMap({
                            open: true,
                            content: "Map"
                        })}>
                    Tap for Location of First Zone on Map
                </Button>
            </View>

            {(gameDetails.numberOfTimes !== 0) ? (
                <View className="small italics end-paragraph" marginTop={"10px"} textAlign={"center"}>
                    You have played {gameDetails.numberOfTimes} time{(gameDetails.numberOfTimes !== 1)? "(s)": ""} before - this game's score will not be on the leaderboard.
                </View>
            ) : null}

            <View className={"end-paragraph"} textAlign={"center"}>
                <TextField
                    name="TeamNameField"
                    margin="10px auto"
                    maxWidth="300px"
                    placeholder=""
                    label="Your Public Team Name for this game?"
                    required
                    value={teamName}
                    onChange={(e) => setTeamNameFunction(e.target.value)}
                />
            </View>

            <View className={"red-alert"} textAlign={"center"}>
                <strong>{numberOfPlayersError}</strong>
            </View>

            <View className={"modal-bottom-bar"} textAlign={"center"}>
                <Button margin="0 0 0 0" className="button" onClick={() => handleViewGameIntro()} >
                    Next
                </Button>
            </View>

            <ModalSlideFromBottom isOpen={modalContentWaiver.show}>
                {(modalContentWaiver.content === "Waiver") && <Waiver gameDetails={gameDetails} gameIntro="true"/>}
            </ModalSlideFromBottom>

            <ModalMap isOpen={modalContentMap.open} setModalContentMap={setModalContentMap}>
                {(modalContentMap.content === "Map") && <Map gameDetailsVar={gameDetails}/>}
            </ModalMap>

            <ModalSlideFromBottom isOpen={modalContentEG.show}>
                {(modalContentEG.content === "Example Game") && <ExampleGame gameIntro="true"/>}
            </ModalSlideFromBottom>

            {/*
            <ModalSlideFromBottom isOpen={modalContentGI.show}>
                {(modalContentGI.content === "Game Intro (old)") &&
                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(gameDetails.gameIntro)}} padding={"0 10px"}></View>
                }
                <Button onClick={() => handlePlayGameIntro()}>Start Game</Button>
            </ModalSlideFromBottom>
            */}

            <ModalGameIntro
                modalContentGI={modalContentGI}
                setModalContentGI={setModalContentGI}
                handlePlayGameIntro = {handlePlayGameIntro}>
                {(modalContentGI.content == "Game Intro") &&
                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(gameDetails.gameIntro)}}  padding={"0 10px"}></View>
                }
            </ModalGameIntro>

        </>
    );
}