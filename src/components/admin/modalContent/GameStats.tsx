// components/GameStatsGen2.tsx
import {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    TextField,
    View
} from '@aws-amplify/ui-react';
import { dataService } from "../../../services/dataService.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";
import {MyAuthContext} from "../../../MyContext.tsx";
import GameScoreView from './GameScoreView.tsx';

type GameScore = Schema["GameScore"]["type"];
type GameStats = Schema["GameStats"]["type"];

interface GameStatsWithScores {
    id: string;
    gameID: string;
    userEmail: string;
    gameName: string;
    gameLocationCity?: string | null;
    gameStates?: string | null;
    type: string;
    disabled?: boolean | null;
    createdAt: string;
    updatedAt: string;
    gameScore: GameScore[];
}

export default function GameStats() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { modalContent } = context;
    const [gameStats, setGameStats] = useState<GameStatsWithScores[]>([]);
    const [userEmailFilter, setUserEmailFilter] = useState('');

    async function myStatsFunction() {
        console.log("myStatsFunction: " + modalContent.id);
        try {
            const client = dataService.getClient();
            const { data: myStatsFromAPI } = await client.models.GameStats.list({
                filter: {
                    gameID: { eq: modalContent.id }
                },
                selectionSet: ['id', 'gameID', 'userEmail', 'gameLocationCity', 'gameName', 'gameStates', 'type', 'disabled', 'createdAt', 'updatedAt', 'gameScore.*']
            });
            console.log("myStatsFromAPI: " + JSON.stringify(myStatsFromAPI));
            setGameStats(myStatsFromAPI as GameStatsWithScores[]);
        } catch (err) {
            console.log('error fetching game stats', err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): (gameStats)");
        myStatsFunction();
    }, []);

    async function deleteGameScore(props: { gameScoreID: string }) {
        console.log("props.gameScoreID: " + props.gameScoreID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameScore.delete({ id: props.gameScoreID });
            myStatsFunction();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }
    
    async function deleteGameStats(props: { gameStatsID: string, gameScores: GameScore[] }) {
        console.log("props.gameStatsID: " + props.gameStatsID);
        try {
            const client = dataService.getAuthClient();
            
            // Delete all associated game scores first
            for (const score of props.gameScores) {
                await client.models.GameScore.delete({ id: score.id });
            }
            
            // Then delete the game stats
            await client.models.GameStats.delete({ id: props.gameStatsID });
            myStatsFunction();
        } catch (err) {
            console.log('error deleting game stats:', err);
        }
    }



    return (
        <>
            <Heading level={5} className="header">{modalContent.action}</Heading>
            <TextField
                label="Filter by User Email"
                placeholder="Enter user email"
                value={userEmailFilter}
                onChange={(e) => setUserEmailFilter(e.target.value)}
            />
            <View>
                {gameStats
                    .filter(gameStat => !userEmailFilter || gameStat.userEmail?.toLowerCase().includes(userEmailFilter.toLowerCase()))
                    .map((gameStat) => (
                    <View key={gameStat.id}>
                        <div>gameStatsID: {gameStat.id} | gameID: {gameStat.gameID}</div>
                        <div>Game: {gameStat.gameName} | {gameStat.gameLocationCity} |
                            <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameStats({gameStatsID: gameStat.id, gameScores: gameStat.gameScore || []})}>
                            X
                        </Button> <span className={"small"}>(delete gameStat and all associated scores)</span></div>
                        <GameScoreView gameScoreArray = {gameStat.gameScore || []} gameName={gameStat.gameName} userEmail={gameStat.userEmail || ''} onDeleteGameScore={(gameScoreID) => deleteGameScore({gameScoreID})}/>
                    </View>
                ))}
            </View>
        </>
    );
}