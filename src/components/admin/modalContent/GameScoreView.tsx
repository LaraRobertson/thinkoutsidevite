import { Button } from '@aws-amplify/ui-react';
import { format } from 'date-fns';
import type { Schema } from "../../../../amplify/data/resource.ts";

type GameScore = Schema["GameScore"]["type"];

interface GameScoreViewProps {
    gameScoreArray: GameScore[];
    gameName: string;
    userEmail: string;
    onDeleteGameScore: (gameScoreID: string) => void;
}

export default function GameScoreView(props: GameScoreViewProps) {
    return (
        <div className="table-container" role="table" aria-label="game score">
            <div className="flex-table header-table" role="rowgroup">
                <div className="flex-row " role="columnheader">Team Name</div>
                <div className="flex-row " role="columnheader">Team Score</div>
                <div className="flex-row" role="columnheader">Total Time</div>
                <div className="flex-row" role="columnheader">Hint Time</div>
                <div className="flex-row" role="columnheader"></div>
                <div className="flex-row" role="columnheader">Delete GameScore</div>
            </div>
            {(props.gameScoreArray.length === 0) && <div><strong>No Game Scores</strong><hr /></div>}
            {props.gameScoreArray.map((score, index) => (
                <div role="rowgroup" className={"row-group"} key={score.id}>
                    <div className="flex-table row">
                        <div className="flex-row first" role="cell">
                            <div>{index+1}</div><div>user.id: {score.userID} team name: {score.teamName}</div></div>
                        <div className="flex-row " role="cell">{score.gameTotalTime}</div>
                        <div className="flex-row" role="cell">
                            {score.gameTotalTime}
                        </div>
                        <div className="flex-row" role="cell">
                            {score.gameHintTime}
                        </div>
                        <div className="flex-row" role="cell"><span className={"small"}>email: {props.userEmail}</span></div>
                        <div className="flex-row" role="cell">updated: {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}</div>
                    </div>
                    <div className="flex-table row">
                        <div className="flex-row four-width" role="cell">Comments: {score.gameComments}</div>
                        <div className="flex-row" role="cell">finished: {score.completed ? ("true"):("false")}  {score.firstTime ? (" - 1st time") :null}</div>

                        <div className="flex-row small" role="cell">
                           gameScoreID: {score.id}
                        </div>
                        <div className={"flex-row"} role={"cell"}>
                            <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => props.onDeleteGameScore(score.id)}>
                                x
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
