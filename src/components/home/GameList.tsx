import {Button, Flex, Heading, View } from "@aws-amplify/ui-react";
import {useEffect, useState, useContext} from "react";
import GameCard from "./GameCard";
import { useGames, useCities } from "../../hooks/useGames";
import type { Game, GameDetails } from "../../types/game";
import DownIcon from "../../assets/noun-arrow-3044495-FFFFFF.svg?react";
import UpIcon from "../../assets/noun-arrow-3044516-up-arrow-FFFFFF.svg?react";

interface GameListProps {
    setGameDetails: (gameDetails: GameDetails | null) => void;
}

export default function GameList(props: GameListProps) {
    const { setGameDetails } = props;

    const [gameLocationPlace, setGameLocationPlace] = useState("");
    const [hideGamesLevels, setHideGamesLevels] = useState(false);
    const [gameListByCityPlace, setGameListByCityPlace] = useState<Game[]>([]);
    const [gameLocationPlaceArray, setGameLocationPlaceArray] = useState<string[]>([]);
    const [gameLocationCity, setGameLocationCity] = useState("");
    
    const { cities } = useCities();
    const { games: gameListByCity, loading } = useGames(gameLocationCity);

    useEffect(() => {
        const gameLocationCityTemp = localStorage.getItem("gameLocationCity");
        if (gameLocationCityTemp) {
            setGameLocationCity(gameLocationCityTemp);
        }
    }, []);

    useEffect(() => {
        const gameLocationPlaceTemp = localStorage.getItem("gameLocationPlace");
        if (gameLocationPlaceTemp && gameLocationPlaceTemp !== "") {
            setGameLocationPlace(gameLocationPlaceTemp);
        }
        
        const gameListByCityPlaceArray = gameListByCity
            .filter(game => game.gameLocationPlace === gameLocationPlaceTemp)
            .sort((a, b) => (parseInt(a.gameLevel || "0") - parseInt(b.gameLevel || "0")));
        
        setGameListByCityPlace(gameListByCityPlaceArray);
    }, [gameListByCity, setGameLocationPlace]);

    useEffect(() => {
        const gameListByCityPlaceArray = gameListByCity
            .filter(game => game.gameLocationPlace === gameLocationPlace)
            .sort((a, b) => (parseInt(a.gameLevel || "0") - parseInt(b.gameLevel || "0")));
        
        setGameListByCityPlace(gameListByCityPlaceArray);
    }, [gameLocationPlace, gameListByCity]);

    useEffect(() => {
        if (gameListByCity.length > 0) {
            const locationTestArray: string[] = [];
            gameListByCity.forEach(game => {
                if (game.gameLocationPlace && !locationTestArray.includes(game.gameLocationPlace)) {
                    locationTestArray.push(game.gameLocationPlace);
                }
            });
            setGameLocationPlaceArray(locationTestArray.sort());
        }
    }, [gameListByCity]);

    const setGameLocationCityFunction = (city: string) => {
        localStorage.setItem("gameLocationCity", city);
        setGameLocationCity(city);
    };

    const setGameLocationPlaceFunction = (location: string) => {
        localStorage.setItem("gameLocationPlace", location);
        setGameLocationPlace(location);
        if (!hideGamesLevels) setHideGamesLevels(true);
    };
    
    return (
        <View id="game-list">

            <Heading level={6} className="heading" marginBottom="5px">
                GAMES ARE IN TESTING MODE<br />Please contact info@escapeout.games to report issues.
            </Heading>

            <View className={gameLocationCity ? "dark-background" : "green-background"} margin="0 auto 5px auto" textAlign="center" fontSize=".7em" padding="5px" lineHeight="1.1em">
                    <Heading level={6} className="heading" marginBottom="5px">
                        {(((gameListByCity.length === 0)&&!gameLocationCity) && !loading) ? "Select Game City: Click on a city to see game locations" : `Game City: ${gameLocationCity}`}
                        {(gameListByCity.length === 0)&&gameLocationCity ? " (no game locations)" : ` (${gameListByCity.length} games)`}
                    </Heading>
            </View>
            
            <Flex direction="row" justifyContent="flex-start" alignItems="stretch" 
                  alignContent="flex-start" wrap="wrap" gap="1rem" className="select-game">
                {cities.map((city) => (
                    <div key={city.id} className="city">
                        <Flex direction="column" justifyContent="flex-start" alignItems="center" 
                              alignContent="center" wrap="wrap" gap=".1rem">
                            <Button 
                                marginRight="5px" 
                                className="button"
                                backgroundColor={(localStorage.getItem("gameLocationCity") === city.cityName) ? "#0b441d" : "#dae9c6"}
                                color={(localStorage.getItem("gameLocationCity") === city.cityName) ? "#ffffff" : "#000000"}
                                onClick={() => setGameLocationCityFunction(city.cityName || "")}
                            >
                                {city.cityName}
                            </Button>
                        </Flex>
                    </div>
                ))}
            </Flex>

            {(gameListByCity.length > 0) && (
                <View>
                    <Heading level={5} className="heading" marginBottom="5px" marginTop="15px">
                        Select Game Location:&nbsp;&nbsp; {gameLocationPlace}
                    </Heading>
                    <Flex direction="row" justifyContent="flex-start" alignItems="stretch" 
                          alignContent="flex-start" wrap="wrap" gap="1rem" className="select-game">
                        {gameLocationPlaceArray.map((place, index) => (
                            <div key={index} className="place">
                                <Flex direction="column" justifyContent="flex-start" alignItems="center" 
                                      alignContent="center" wrap="wrap" gap=".1rem">
                                    <Button 
                                        marginRight="5px" 
                                        className="button"
                                        backgroundColor={(gameLocationPlace === place) ? "#0b441d" : "#dae9c6"}
                                        color={(gameLocationPlace === place) ? "#ffffff" : "#000000"}
                                        onClick={() => setGameLocationPlaceFunction(place)}
                                    >
                                        {place}
                                    </Button>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </View>
            )}

            {(gameListByCityPlace.length > 0) && (
                <View>
                    <Flex direction="row" justifyContent="space-between" alignItems="center" 
                          marginTop="15px" marginBottom="5px">
                        <Heading level={6} className="heading">
                            Games in {gameLocationPlace}:
                        </Heading>
                        {/* not sure why this show/hide is here  - removed !hideGameLevels from below */}
                        <button className="hide" onClick={() => setHideGamesLevels(!hideGamesLevels)}>
                            {hideGamesLevels ?
                                <DownIcon width={15} height={15} /> :
                                <UpIcon width={15} height={15} />
                            }
                        </button>
                    </Flex>

                    <Flex direction="row" justifyContent="flex-start" alignItems="stretch"
                          alignContent="flex-start" wrap="wrap" gap="1rem" className="select-game">
                        {gameListByCityPlace.map((game) => (
                            <GameCard key={game.id} game={game} setGameDetails={setGameDetails} />
                        ))}
                    </Flex>

                </View>
            )}
        </View>
    );
}