import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type GameStats = Schema["GameStats"]["type"];
type GameScore = Schema["GameScore"]["type"];

interface GameDetailsVar {
    email: string;
    gameID: string;
}

interface WaiverResult {
    waiverSigned: boolean;
    numberOfTimes: number;
}

export async function checkWaiver(gameDetailsVar: GameDetailsVar): Promise<WaiverResult | null> {
    try {
        const client = dataService.getClient();
        
        // Get game stats for this user and game
        const { data: gameStatsFromAPI } = await client.models.GameStats.list({
            filter: {
                userEmail: { eq: gameDetailsVar.email },
                gameID: { eq: gameDetailsVar.gameID }
            }
        });

        if (gameStatsFromAPI.length > 0) {
            // User has signed waiver and there is a gameStat
            const gameStats = gameStatsFromAPI[0];
            
            try {
                // Get game scores for this game stats
                const { data: gameScoresFromAPI } = await client.models.GameScore.list({
                    filter: {
                        gameStatsID: { eq: gameStats.id }
                    }
                });

                if (gameScoresFromAPI) {
                    console.log("gamesScoreFromAPI (home): " + gameScoresFromAPI.length);
                    return {
                        waiverSigned: true, 
                        numberOfTimes: gameScoresFromAPI.length
                    };
                } else {
                    return {
                        waiverSigned: true, 
                        numberOfTimes: 0
                    };
                }
            } catch (err) {
                console.log("error fetching game scores:", err);
                return null;
            }
        } else {
            // First time
            console.log("first time");
            return {
                waiverSigned: false, 
                numberOfTimes: 0
            };
        }
    } catch (err) {
        console.log("error fetching game stats:", err);
        return null;
    }
}