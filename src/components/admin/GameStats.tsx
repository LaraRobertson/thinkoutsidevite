// components/GameStatsGen2.tsx
import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View
} from '@aws-amplify/ui-react';
import { format } from 'date-fns'
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type GameScore = Schema["GameScore"]["type"];
type GameStats = Schema["GameStats"]["type"];

interface GameStatsWithScores extends GameStats {
    gameScore: {
        items: GameScore[];
    };
}

interface ModalContent {
    id: string;
    action: string;
}

interface GameStatsProps {
    modalContent: ModalContent;
}

interface GameScoreViewProps {
    gameScoreArray: GameScore[];
    gameName: string;
    index: number;
    userEmail: string;
}

export default function GameStats(props: GameStatsProps) {
    let modalContent = props.modalContent;
    const [gameStats, setGameStats] = useState<GameStatsWithScores[]>([]);

    async function myStatsFunction() {
        console.log("myStatsFunction: " + modalContent.id);
        try {
            const client = dataService.getClient();
            const { data: myStatsFromAPI } = await client.models.GameStats.list({
                filter: {
                    gameID: { eq: modalContent.id }
                }
            });
            console.log("myStatsFromAPI: " + myStatsFromAPI);
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
            const client = dataService.getClient();
            await client.models.GameScore.delete({ id: props.gameScoreID });
            myStatsFunction();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }
    
    async function deleteGameStats(props: { gameStatsID: string }) {
        console.log("props.gameStatsID: " + props.gameStatsID);
        try {
            const client = dataService.getClient();
            await client.models.GameStats.delete({ id: props.gameStatsID });
            myStatsFunction();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }

    const GameScoreView = (props: GameScoreViewProps) => {
        return (
            <div className="table-container" role="table" aria-label="game score">
                <div className="flex-table header-table" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Total Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Finished</div>
                </div>
                {(props.gameScoreArray.length === 0) && <div><strong>No Game Scores</strong><hr /></div>}
                {props.gameScoreArray.map((score, index) => (
                    <div role="rowgroup" key={score.id}>
                        <div className="flex-table row">
                            <div className="flex-row first" role="cell">{index+1}: {score.teamName} <br />
                                <span className={"small"}>{props.userEmail}</span></div>
                            <div className="flex-row " role="cell">{score.gameTotalTime}</div>
                            <div className="flex-row" role="cell">
                                {score.gameTotalTime}
                            </div>
                            <div className="flex-row" role="cell">
                                {score.gameHintTime}
                            </div>
                            <div className="flex-row" role="cell">{score.completed ? ("true"):("false")}  {score.firstTime ? (" - 1st time") :null}</div>

                        </div>
                        <div className="flex-table row">
                            <div className="flex-row four-width" role="cell">Comments: {score.gameComments}</div>
                            <div className="flex-row small" role="cell"> updated: {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}<br />


                                <div style={{backgroundColor:"white"}}>{score.id}
                                    <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameScore({"gameScoreID": score.id})}>
                                    x
                                </Button></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5} className="header">{modalContent.action}</Heading>
            <View>
                {gameStats.map((gameStat, index) => (
                    <View key={gameStat.id}>
                        <div>Game: {gameStat.gameName} | {gameStat.gameLocationCity} |
                            <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameStats({"gameStatsID": gameStat.id})}>
                            x
                        </Button> <span className={"small"}>(delete if no game scores)</span></div>
                        <GameScoreView gameScoreArray = {gameStat.gameScore?.items || []} gameName={gameStat.gameName} index={index} userEmail={gameStat.userEmail}/>
                    </View>
                ))}
            </View>
        </>
    );
}