import {Button, Card, Flex, Text, View} from "@aws-amplify/ui-react";
import {useContext} from "react";
import {checkWaiver} from "./checkWaiver";
import {MyAuthContext} from "../../MyContext";
import {useNavigate} from "react-router-dom";
import type { Game, GameDetailsVar, GameDetails } from "../../types/game";

interface GameCardProps {
    game: Game;
    setGameDetails: (gameDetails: GameDetails | null) => void;
}

export default function GameCard({game, setGameDetails}: GameCardProps) {
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
        gamePlayZone,
        gameType,
        id,
        walkingDistance
    } = game;

    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameCard must be used within MyAuthContext.Provider");
    const { authStatus, email, gamesIDUserPlayed, gamesIDUser, setModalContent } = context;

    const handleGameDetail = (gameDetailsVar: Partial<GameDetailsVar>) => {
        setGameDetails(gameDetailsVar);
        setModalContent({ open: true, content: "Game Detail", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
    };

    const handleLeaderboard = (gameDetailsVar: Pick<GameDetailsVar, 'gameName' | 'gameID'>) => {
        setGameDetails(gameDetailsVar);
        setModalContent({ open: true, content: "Leaderboard", id: "", action: "", gameID: "", zoneID: "", updatedDB: false });
    };

    const handlePlayGameList = async (gameDetailsVar: GameDetailsVar) => {
        if (gameDetailsVar.waiverSigned !== gameDetailsVar.gameID) {
            const checkWaiverObject = await checkWaiver(gameDetailsVar);
            
            if (checkWaiverObject?.waiverSigned) {
                setGameDetails({
                    ...gameDetailsVar,
                    waiverSigned: gameDetailsVar.gameID,
                    numberOfTimes: checkWaiverObject.numberOfTimes
                });
                setModalContent({ open: true, content: "Game Intro", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
            } else {
                setGameDetails(gameDetailsVar);
                setModalContent({ open: true, content: "Waiver", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
            }
        } else {
            setGameDetails(gameDetailsVar);
            setModalContent({ open: true, content: "Game Intro", id: "", modalStyle: "game-details", action: "", gameID: "", zoneID: "", updatedDB: false });
        }
    };

    const firstZone = gamePlayZone?.items?.[0];
    const isPlayed = gamesIDUserPlayed?.includes(id);
    const canPlay = gamesIDUser?.includes(id) || gameType === "free" || gameType === "free-test";
    
    const cardStyle = {
        backgroundImage: firstZone?.gameZoneImage ? `url(${firstZone.gameZoneImage})` : undefined
    };

    const gameDetailsData = {
        email: email || "",
        gameName: gameName || "",
        gameID: id,
        gameLocationCity: gameLocationCity || "",
        gameDescription: gameDescription || "",
        gameSummary: gameSummary || "",
        gameIntro: gameIntro || "",
        gameLogisticInfo: gameLogisticInfo || "",
        gameGoals: gameGoals || "",
        gamePlayZoneImage1: firstZone?.gameZoneImage || "",
        waiverSigned: undefined,
        numberOfTimes: undefined,
        latitude1: firstZone?.latitude || "",
        longitude1: firstZone?.longitude || "",
        gameLevel: gameLevel || "",
    };
    
    return (
        <Card
            style={cardStyle}
            className={isPlayed ? "hide" : "game-card"}
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
                    {isPlayed ? (
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
                            {canPlay && (
                                <View textAlign="center" marginBottom="0">
                                    <Button
                                        className="button button-center-gc button-light-dark show"
                                        onClick={() => handlePlayGameList(gameDetailsData)}
                                    >
                                        Play Game
                                    </Button>
                                    <View className="italics small">time doesn't start yet</View>
                                </View>
                            )}
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
                            onClick={() => handleLeaderboard({
                                gameName: gameName || "",
                                gameID: id
                            })}
                        >
                            Leaderboard
                        </Button>
                    </View>
                    <View className="italics small">tap on Leaderboard to see some times</View>
                </View>
            </View>
        </Card>
    );
}