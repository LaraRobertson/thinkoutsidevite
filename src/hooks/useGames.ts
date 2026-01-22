import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import type { Game, City } from "../types/game";

export const useGames = (gameLocationCity: string | null) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGames = async () => {
        if (!gameLocationCity) return;
        
        setLoading(true);
        try {
            const client = dataService.getClient();
            const { data: gamesFromAPI } = await client.models.Game.list({
                filter: {
                    disabled: { eq: false },
                    gameLocationCity: { eq: gameLocationCity }
                }
            });
            
            const sortedGames = gamesFromAPI.sort((a, b) => (a.order || 0) - (b.order || 0));
            setGames(sortedGames);
        } catch (err) {
            console.error("Error fetching games:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [gameLocationCity]);

    return { games, loading, refetch: fetchGames };
};

export const useCities = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const client = dataService.getClient();
                const { data: citiesFromAPI } = await client.models.City.list({
                    filter: { disabled: { eq: false } }
                });
                setCities(citiesFromAPI);
            } catch (err) {
                console.error("Error fetching cities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    return { cities, loading };
};