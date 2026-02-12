import {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View,
    Flex
} from '@aws-amplify/ui-react';
import { format } from 'date-fns';
import {MyAuthContext} from '../../../MyContext';
import { dataService } from '../../../services/dataService';
import type { Schema } from '../../../../amplify/data/resource';

type GameScore = Schema["GameScore"]["type"];

interface GameStatsWithScores {
    id: string;
    gameName: string | null;
    gameLocationCity: string | null;
    gameScore: GameScore[];
}

interface GameScoreViewProps {
    gameScoreArray: GameScore[];
    gameName: string;
    showAllTimeButton: boolean;
}

export default function MyStats() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("MyStats must be used within MyAuthContext.Provider");
    const { user } = context;
    const email = user?.signInDetails?.loginId || '';
    const [myStats, setMyStats] = useState<GameStatsWithScores[]>([]);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);

    async function myStatsFunction(date: string) {
        if (!email) return;
        
        setShowAllTimeButton(date !== "2021-04-01");
        
        try {
            const client = dataService.getClient();
            const { data: myStatsFromAPI } = await client.models.GameStats.list({
                filter: {
                    userEmail: { eq: email },
                    type: { eq: "gameStats" }
                },
                selectionSet: ['id', 'gameName', 'gameLocationCity', 'gameScore.*']
            });
            
            if (myStatsFromAPI) {
                const sortedStats = [...myStatsFromAPI].sort((a, b) => 
                    (b.gameName || '').localeCompare(a.gameName || '')
                );
                setMyStats(sortedStats as GameStatsWithScores[]);
            }
        } catch (err) {
            console.log("error fetching gameStatsSortedByGameName", err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): " + email);
        myStatsFunction("2021-04-01");
    }, [email]);

    const GameScoreView = (props: GameScoreViewProps) => {
        const today = new Date();
        
        return (
            <div className="table-container myStats" role="table" aria-label="game score" key={props.gameName}>
                <div className="flex-table public-modal" role="rowgroup">
                    <div className="flex-row fifths header" role="columnheader">Team Name</div>
                    <div className="flex-row fifths header" role="columnheader">Team Score</div>
                    <div className="flex-row fifths header" role="columnheader">Total Time</div>
                    <div className="flex-row fifths header" role="columnheader">Hint Time</div>
                    <div className="flex-row fifths header" role="columnheader">Finished</div>
                </div>
                {props.gameScoreArray.map((score) => (
                    <div role="rowgroup" key={score.id} className={((props.showAllTimeButton) && (format(new Date(score.updatedAt), "yyyy-MM-dd") != today.toLocaleDateString('en-CA'))) ? "hide" : "show"}>
                        <div className="flex-table row public-modal">
                            <div className="flex-row fifths" role="cell"> {score.teamName}</div>
                            <div className="flex-row fifths " role="cell">{score.gameTotalTime}</div>
                            <div className="flex-row fifths" role="cell">
                                {score.gameTotalTime}
                            </div>
                            <div className="flex-row fifths" role="cell">
                                {score.gameHintTime}
                            </div>
                            <div className="flex-row fifths" role="cell">{score.completed ? ("true"):("false")}  {score.firstTime ? (" - 1st time") :null}</div>
                        </div>
                        <div className="flex-table row public-modal">
                            <div className="flex-row four-width-home" role="cell">Comments: {score.gameComments}</div>
                            <div className="flex-row  fifths small" role="cell"> {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5} >{email}</Heading>
            <Flex>
                {(!showAllTimeButton) &&
                <Button className={"button"} onClick={() =>  myStatsFunction(new Date().toLocaleDateString('en-CA'))}>
                    tap to see today</Button>}
                {(showAllTimeButton) && <Button className={"button"} onClick={() =>  myStatsFunction("2021-04-01")}>
                    tap to see all time</Button>}
            </Flex>
            <Heading level={3} className={showAllTimeButton ? "heading light" : "hide"} >Completed Today</Heading>
            <Heading level={3} className={showAllTimeButton ? "hide" : "heading light"} >All Time</Heading>

            <View>
                {myStats.map((userStat, index) => (
                    <View key={userStat.id}>
                    {(userStat.gameScore && userStat.gameScore.length > 0) &&
                        (<View key={index}>
                            <div>Game: {userStat.gameName} | {userStat.gameLocationCity}</div>
                            <GameScoreView gameScoreArray = {userStat.gameScore} gameName={userStat.gameName || ''} showAllTimeButton={showAllTimeButton} />
                        </View>)
                    }
                    </View>
                ))}
            </View>
        </>
    );
}