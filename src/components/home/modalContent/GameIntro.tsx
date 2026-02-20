import {Button, Heading, View, TextField, Image} from "@aws-amplify/ui-react";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers
} from "obscenity";
import {MyAuthContext} from "../../../MyContext";
import { dataService } from "../../../services/dataService";
import Waiver from "./Waiver";
import DOMPurify from "dompurify";
import {ModalWaiver, ModalMap, ModalGameIntro} from "../../Modals";
import {Map} from "../../Map";
import type { GameDetails } from "../../../types/game";
import { getDefaultModalContent, createModalContent } from "../../../utils/modalHelpers";

interface GameIntroProps {
    gameDetails: GameDetails;
    setGameDetails: (gameDetails: GameDetails | null) => void;
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
    const { gameDetails, setGameDetails } = props;
    const navigate = useNavigate();
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { user, setModalContent } = context;
    if (!user || !user.signInDetails) throw new Error("User must be authenticated to access GameIntro");
    const userEmail = user.signInDetails.loginId;
    /* Modal Content */
    const [modalContentGI, setModalContentGI] = useState<ModalContentState>({show:false, content:""});
    const [modalContentWaiver, setModalContentWaiver] = useState<ModalContentState>({show:false, content:""});
    const [modalContentMap, setModalContentMap] = useState<ModalContentMap>({open: false, content: ""});
    
    console.log('gameDetails.gameName: ' + gameDetails.gameName);
    
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const [numberOfPlayersError, setNumberOfPlayersError] = useState("");
    const [teamName, setTeamName] = useState("");
    //const [hideWaiver, setHideWaiver] = useState(true);
    const [gamePlayZoneImage, setGamePlayZoneImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchGamePlayZoneImage = async () => {
            try {
                const client = dataService.getClient();
                const { data: zones } = await client.models.GamePlayZone.list({
                    filter: {
                        gameID: { eq: gameDetails.gameID },
                        order: { eq: 1 }
                    }
                });
                if (zones.length > 0 && zones[0].gameZoneImage) {
                    setGamePlayZoneImage(zones[0].gameZoneImage);
                }
            } catch (err) {
                console.error("Error fetching GamePlayZone image:", err);
            }
        };
        
        fetchGamePlayZoneImage();
        handleViewGameIntro();
    }, []);

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
                    userEmail: userEmail || "",
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
                        userEmail: { eq: userEmail || "" }
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
                setModalContent(getDefaultModalContent());
                
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
                setModalContent(createModalContent({
                    open: true,
                    content: "Waiver"
                }));
            }
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        handleViewGameIntro();
    }, []);
    
    function handleViewWaiver() {
        console.log("handleViewWaiver");
        /*if (hideWaiver) {
            setModalContentWaiver({
                show: true,
                content: "Waiver"
            });
        }*/
        setModalContentWaiver({
            show: true,
            content: "Waiver"
        });
        //setHideWaiver(!hideWaiver);
    }

    function handleViewGameIntro() {
        console.log("handleViewGameIntro: " + teamName + " waiver?: " + gameDetails.waiverSigned);
        if ((teamName !== "" && gameDetails.waiverSigned === gameDetails.gameID)) {
            console.log("go to game start");
            setModalContentGI({
                show: true,
                content: "Are You Ready"
            });

        } else {
            console.log("show teamName error message: HandlePlayGameIntro");
            
            if (gameDetails.waiverSigned === gameDetails.gameID) {
                console.log("waiver signed (handlePlayGameIntro)");
                setNumberOfPlayersError("Please provide a Team Name");
            } else {
                /* go to waiver */
                setModalContent({
                    gameDesigner: "", puzzleID: "",
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

    function DangerouslySetInnerHTMLSanitized(htmlContent: string | undefined) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent || "");
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
                Generally Clues/Answers for Each Zone are within a 150 feet of Zone location.
            </View>
            <View className={"small end-paragraph"} textAlign={"center"}>
                <strong>You Have Signed Waiver</strong>:
                    <Button onClick={() => handleViewWaiver()} variation={"link"}>
                            View Waiver
                    </Button>
                <div className={"hide"}>
                    <Waiver gameDetails={gameDetails} setGameDetails={setGameDetails} gameIntro={true}/>
                </div>
            </View>
            <Heading level={6} textAlign={"center"} marginTop={"10px"} marginBottom={"5px"}>
                Start Playing when you are here:
            </Heading>
            <View className={"end-paragraph"} textAlign={"center"}>
                <Image alt={gameDetails.gameName} maxHeight="100px" src={gamePlayZoneImage}/><br />
                <Button className="quit-button dark"
                        onClick={() => setModalContentMap({
                            open: true,
                            content: "Map"
                        })}>
                   Location of First Zone on Map
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
                    label="Enter Your Public Team Name:"
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

            <ModalWaiver isOpen={modalContentWaiver.show} setModalContentWaiver={setModalContentWaiver}>
                {(modalContentWaiver.content === "Waiver") && <Waiver setGameDetails={setGameDetails} gameDetails={gameDetails} gameIntro={true}/>}
            </ModalWaiver>

            <ModalMap isOpen={modalContentMap.open} setModalContentMap={setModalContentMap}>
                {(modalContentMap.content === "Map") && <Map gameDetails={gameDetails} gameIntro={true}/>}
            </ModalMap>

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
                {(modalContentGI.content == "Are You Ready") &&
                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(gameDetails.gameIntro)}}  padding={"0 10px"}></View>
                }
            </ModalGameIntro>

        </>
    );
}