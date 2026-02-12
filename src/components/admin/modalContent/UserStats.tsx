import {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    TextField,
    View
} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext.tsx";
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import GameScoreView from "./GameScoreView.tsx";

type GameScore = Schema["GameScore"]["type"];
type GameStats = Schema["GameStats"]["type"];

export default function UserStats() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ClueForm must be used within MyAuthContext.Provider");
    const { modalContent } = context;
    const [myStats, setMyStats] = useState<GameStats[]>([]);
    const [gameScores, setGameScores] = useState<Record<string, GameScore[]>>({});
    const [gameNameFilter, setGameNameFilter] = useState('');

    async function loadUserStats() {
        try {
            const client = dataService.getClient();
            const { data: statsFromAPI } = await client.models.GameStats.list({
                filter: {
                    userEmail: {
                        eq: modalContent.userEmail
                    }
                }
            });
            
            if (statsFromAPI) {
                setMyStats(statsFromAPI);
                
                // Load game scores for each stat
                const scoresMap: Record<string, GameScore[]> = {};
                for (const stat of statsFromAPI) {
                    const { data: scores } = await client.models.GameScore.list({
                        filter: {
                            gameStatsID: {
                                eq: stat.id
                            }
                        }
                    });
                    if (scores) {
                        scoresMap[stat.id] = scores;
                    }
                }
                setGameScores(scoresMap);
            }
        } catch (err) {
            console.log("error fetching user stats", err);
        }
    }

    useEffect(() => {
        if (modalContent.userEmail) {
            loadUserStats();
        }
    }, [modalContent.userEmail]);


    async function deleteGameScore(props: { gameScoreID: string }) {
        console.log("props.gameScoreID: " + props.gameScoreID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameScore.delete({ id: props.gameScoreID });
            loadUserStats();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }

    async function deleteGameStats(gameStatsID: string, gameScores: GameScore[]) {
        try {
            const client = dataService.getAuthClient();
            
            // Delete all associated game scores first
            for (const score of gameScores) {
                await client.models.GameScore.delete({ id: score.id });
            }
            
            // Then delete the game stats
            await client.models.GameStats.delete({ id: gameStatsID });
            loadUserStats();
        } catch (err) {
            console.log('error deleting game stats:', err);
        }
    }

    return (
        <>
            <Heading level={5}>{modalContent.userEmail}</Heading>
            <TextField
                label="Filter by Game Name"
                placeholder="Enter game name"
                value={gameNameFilter}
                onChange={(e) => setGameNameFilter(e.target.value)}
            />
            <View>
                {myStats
                    .filter(userStat => !gameNameFilter || userStat.gameName?.toLowerCase().includes(gameNameFilter.toLowerCase()))
                    .map((userStat) => (
                    <View key={userStat.id}>
                        <div>
                            Game: {userStat.gameName} | {userStat.gameLocationCity} | {userStat.gameStates}
                            <Button 
                                gap="0.1rem" 
                                marginLeft="5px" 
                                size="small" 
                                color="red" 
                                onClick={() => deleteGameStats(userStat.id, gameScores[userStat.id] || [])}
                            >
                                x
                            </Button> 
                            <span className="small">(delete gameStat and all associated scores)</span>
                        </div>
                        {gameScores[userStat.id] && gameScores[userStat.id].length > 0 && (
                            <View>
                                <GameScoreView  gameScoreArray={gameScores[userStat.id]} gameName={userStat.gameName || ''} userEmail={modalContent.userEmail || ''} onDeleteGameScore={(gameScoreID) => deleteGameScore({gameScoreID})}/>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </>
    );
}