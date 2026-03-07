import {useEffect, useMemo, useState} from "react";

import Filters from "./Filters.tsx";

import {dataService} from "../../../services/dataService.ts";
import type {Game, GameDetails} from "../../../types/game.ts";
import GameCard from "../GameCard.tsx";
import {useCities} from "../../../hooks/useGames.ts";
import {Flex} from "@aws-amplify/ui-react";

export interface FiltersState {
    city: string;
    place: string;
}
interface GameListProps {
    setGameDetails: (gameDetails: GameDetails | null) => void;
    gamesIDUserPlayed: string[];
    gamesIDUser: string[];
}

export default function GameList2(props: GameListProps) {
    const { setGameDetails, gamesIDUserPlayed, gamesIDUser } = props;
    const [games, setGames] = useState<Game[]>([]);
    const { cities } = useCities();
    //const [loading, setLoading] = useState(false);

    /* Filter State */
    const [filters, setFilters] = useState<FiltersState>({
        city: "",
        place: ""
    });

    /* DERIVED STATES */

    const places = useMemo(() => {
        return [
            ...new Set(
                games
                    .filter(l =>
                        !filters.city || l.gameLocationCity === filters.city
                    )
                    .map(l => l.gameLocationPlace)
                    .filter((place): place is string => place != null)
            )
        ];
    }, [filters.city, games]);


    const fetchGames = async () => {

        //setLoading(true);
        try {
            const client = dataService.getClient();
            const { data: gamesFromAPI } = await client.models.Game.list({
                filter: {
                    disabled: { eq: false }
                }
            });

            const sortedGames = gamesFromAPI.sort((a, b) => (a.order || 0) - (b.order || 0));
            setGames(sortedGames);
        } catch (err) {
            console.error("Error fetching games:", err);
        } finally {
            //setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    /* FILTER RESULTS */
    const filteredListings = useMemo(() => {
        return games.filter(l =>
            (!filters.city || l.gameLocationCity === filters.city) &&
            (!filters.place || l.gameLocationPlace === filters.place)
        );
    }, [filters, games]);

    return (
        <div>
            <h1>Games</h1>

            <Filters
                filters={filters}
                cities={cities}
                places={places}
                onChange={setFilters}
            />

            <Flex direction="row" justifyContent="flex-start" alignItems="stretch"
                  alignContent="flex-start" wrap="wrap" gap="1rem" className="select-game">
                {filteredListings.map((game) => (
                    <GameCard key={game.id} game={game} setGameDetails={setGameDetails}
                              hasPlayed={gamesIDUserPlayed.includes(game.id)}
                              canPlay={gamesIDUser.includes(game.id)}/>
                ))}
            </Flex>
        </div>
    );
}