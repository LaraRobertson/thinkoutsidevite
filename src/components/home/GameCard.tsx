import {Button, Card, Flex, Text, View} from "@aws-amplify/ui-react";
import {useContext} from "react";
import {checkWaiver} from "./checkWaiver";
import {MyAuthContext} from "../../MyContext";
import {useNavigate} from "react-router-dom";
import type { Game, GameDetails } from "../../types/game";

interface GameCardProps {
    game: Game;
    setGameDetails: (gameDetails: GameDetails | null) => void;
    hasPlayed: boolean;
    canPlay: boolean;
}

export default function GameCard({game, setGameDetails, hasPlayed, canPlay }: GameCardProps) {
    const navigate = useNavigate();
    const {
        gameLogisticInfo,
        gameSummary,
        gameDescription,
        gameIntro,
        gameLevel,
        gameLocationCity,
        gameLocationPlace,
        gameName,
        gameGoals,
        gameType,
        id,
        walkingDistance,
        latitude,
        longitude
    } = game;

    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameCard must be used within MyAuthContext.Provider");
    const { authStatus, user, setModalContent } = context;
    const userEmail = user?.signInDetails?.loginId;

    const handleGameDetail = (gameDetails: GameDetails) => {
        setGameDetails(gameDetails);
        setModalContent({
            gameDesigner: "",
            puzzleID: "",
            open: true, content: "Game Detail", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
    };

    const handleLeaderboard = (gameDetails: GameDetails) => {
        setGameDetails(gameDetails);
        setModalContent({
            gameDesigner: "",
            puzzleID: "",
            open: true, content: "Leaderboard", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
    };

    const handlePlayGameList = async (gameDetails: GameDetails) => {
        setGameDetails(gameDetails);
        
        if (gameDetails.waiverSigned !== gameDetails.gameID) {
            console.log("checkWaiverObject: ", gameDetails);
            const checkWaiverObject = await checkWaiver(gameDetails);
            
            if (checkWaiverObject?.waiverSigned) {
                setGameDetails({
                    ...gameDetails,
                    waiverSigned: gameDetails.gameID,
                    numberOfTimes: checkWaiverObject.numberOfTimes
                });
                setModalContent({
                    gameDesigner: "",
                    puzzleID: "",
                    open: true, content: "Game Intro", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
            } else {
                setModalContent({
                    gameDesigner: "",
                    puzzleID: "",
                    open: true, content: "Waiver", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
            }
        } else {
            setModalContent({
                gameDesigner: "",
                puzzleID: "",
                open: true, content: "Game Intro", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
        }
    };
    /*
    *  const canPlay = gamesIDUser?.includes(id) || gameType === "free" || gameType === "free-test";
    **** may use canPlay if some games cost money but not now ****
     */
    console.log("canPlay: " + canPlay + " " + gameName);

    const gameDetailsData = {
        email: userEmail || "",
        gameName: gameName || "",
        gameID: id,
        gameLocationCity: gameLocationCity || "",
        gameDescription: gameDescription || "",
        gameSummary: gameSummary || "",
        gameIntro: gameIntro || "",
        gameLogisticInfo: gameLogisticInfo || "",
        gameGoals: gameGoals || "",
        waiverSigned: undefined,
        numberOfTimes: undefined,
        latitude: latitude || "",
        longitude: longitude || "",
        gameLevel: gameLevel || "",
    };
   //console.log("game details: " + JSON.stringify(game, null, 2))
    return (
        <Card
            className={"game-card"}
            variation="elevated"
        >
            <View className="inner-game-card">
                {/* am not doing levels now */}
                <View className="game-card-full level hide" backgroundColor="white">
                    <Text color="black">
                        <span className="italics">level</span>: {gameLevel}
                    </Text>
                </View>
                <View className="game-card-full">
                    {/*canPlay && <Text className="game-card-header">(can play)</Text>*/}
                    {hasPlayed ? (
                        <Text className="game-card-header played">
                            {gameName} <span className="small">(played)</span>
                        </Text>
                    ) : (
                        <Text className="game-card-header">
                            {gameName} <span className="small">({gameType})</span>
                        </Text>
                    )}
                </View>
                <View className="game-card-full">
                    <Text className={"green-link"}>{gameLocationPlace}</Text>
                </View>
                <View className="game-card-full small">
                    {walkingDistance &&
                    <Text className={"green-link"}>{walkingDistance} walking distance</Text>}
                </View>
            </View>
            
            <View className="inner-game-card1">
                <Flex justifyContent="center">
                    {authStatus !== "authenticated" ? (
                        <View textAlign="center">
                            <Button
                                className="button button-center show button-light-dark"
                                onClick={() => navigate("/login")}
                            >
                                Sign in to Play Game
                            </Button>
                        </View>
                    ) : (
                        <View textAlign="center">
                                <View textAlign="center" marginBottom="0">
                                    <Button
                                        className="button button-center-gc button-light-dark show"
                                        onClick={() => handlePlayGameList(gameDetailsData)}
                                    >
                                        Play Game
                                    </Button>
                                    <View className="italics small">time doesn't start yet</View>
                                </View>
                        </View>
                    )}
                </Flex>
                
                <View className="game-card-full light-dark">
                    <View className="example" marginTop="10px">
                        <Button
                            className="button button-small show"
                            onClick={() => handleGameDetail(gameDetailsData)}
                        >
                            Game Details
                        </Button>
                    </View>
                    <View className="example" marginBottom="0">
                        <Button 
                            className="button button-small show"
                            onClick={() => handleLeaderboard(gameDetailsData)}
                        >
                            Leaderboard
                        </Button>
                    </View>
                    <View className="italics small">Leaderboard shows fastest times</View>
                </View>
            </View>
        </Card>
    );
}