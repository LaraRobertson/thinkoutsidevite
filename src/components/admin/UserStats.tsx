import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View
} from '@aws-amplify/ui-react';
import { format } from 'date-fns'
import {MyAuthContext} from "../../MyContext";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type GameScore = Schema["GameScore"]["type"];
type GameStats = Schema["GameStats"]["type"];

interface GameScoreViewProps {
    gameScoreArray: GameScore[];
    gameName: string;
}

export default function UserStats() {
    const { modalContent } = useContext(MyAuthContext);
    const [myStats, setMyStats] = useState<GameStats[]>([]);
    const [gameScores, setGameScores] = useState<Record<string, GameScore[]>>({});

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

    async function deleteGameScore(gameScoreID: string) {
        try {
            const client = dataService.getClient();
            await client.models.GameScore.delete({ id: gameScoreID });
            loadUserStats();
        } catch (err) {
            console.log('error deleting game score:', err);
        }
    }

    async function deleteGameStats(gameStatsID: string) {
        try {
            const client = dataService.getClient();
            await client.models.GameStats.delete({ id: gameStatsID });
            loadUserStats();
        } catch (err) {
            console.log('error deleting game stats:', err);
        }
    }

    const GameScoreView = ({ gameScoreArray, gameName }: GameScoreViewProps) => {
        return (
            <div className="table-container" role="table" aria-label="game score" key={gameName}>
                <div className="flex-table header" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Total Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Finished</div>
                </div>
                {gameScoreArray.map((score) => (
                    <React.Fragment key={score.id}>
                        <div role="rowgroup">
                            <div className="flex-table row">
                                <div className="flex-row first" role="cell">{score.teamName}</div>
                                <div className="flex-row " role="cell">{score.gameTotalTime}</div>
                                <div className="flex-row" role="cell">{score.gameTotalTime}</div>
                                <div className="flex-row" role="cell">{score.gameHintTime}</div>
                                <div className="flex-row" role="cell">
                                    {score.completed ? "true" : "false"}
                                    {score.firstTime ? " - 1st time" : null}
                                </div>
                            </div>
                            <div className="flex-table row">
                                <div className="flex-row four-width" role="cell">
                                    Comments: {score.gameComments}
                                </div>
                                <div className="flex-row small" role="cell">
                                    {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}<br />
                                    <div style={{backgroundColor: "white"}}>
                                        {score.id}
                                        <Button 
                                            gap="0.1rem" 
                                            marginLeft="5px" 
                                            size="small" 
                                            color="red" 
                                            onClick={() => deleteGameScore(score.id)}
                                        >
                                            x
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5}>{modalContent.userEmail}</Heading>
            <View>
                {myStats.map((userStat) => (
                    <View key={userStat.id}>
                        <div>
                            Game: {userStat.gameName} | {userStat.gameLocationCity} | {userStat.gameStates}
                            <Button 
                                gap="0.1rem" 
                                marginLeft="5px" 
                                size="small" 
                                color="red" 
                                onClick={() => deleteGameStats(userStat.id)}
                            >
                                x
                            </Button> 
                            <span className="small">(delete if no game scores)</span>
                        </div>
                        {gameScores[userStat.id] && gameScores[userStat.id].length > 0 && (
                            <View>
                                <GameScoreView 
                                    gameScoreArray={gameScores[userStat.id]} 
                                    gameName={userStat.gameName || ''} 
                                />
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </>
    );
}