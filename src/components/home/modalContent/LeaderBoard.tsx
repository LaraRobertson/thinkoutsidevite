import {useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View,
} from '@aws-amplify/ui-react';
import { format } from 'date-fns';
import { dataService } from '../../../services/dataService';
import type { GameDetails } from '../../../types/game';

interface LeaderBoardScore {
    id: string;
    teamName: string | null;
    gameTotalTime: number;
    createdAt: string;
}

interface LeaderBoardProps {
    gameDetails: GameDetails;
}

export default function LeaderBoard(props: LeaderBoardProps) {
    const [leaderBoardGameID] = useState(props.gameDetails.gameID);
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoardScore[]>([]);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);

    const today = new Date();

    async function leaderBoardFunction(date: string) {
        console.log("date: " + date);
        console.log("gameID: " + leaderBoardGameID);
        console.log("leaderboard");
        
        setShowAllTimeButton(date !== "2021-04-01");

        try {
            const client = dataService.getClient();
            const { data: gameScores } = await client.models.GameScore.list({
                filter: {
                    gameID: { eq: leaderBoardGameID },
                    completed: { eq: true },
                    firstTime: { eq: true },
                    createdAt: { gt: date }
                },
                selectionSet: ['id', 'teamName', 'gameTotalTime', 'createdAt']
            });

            if (gameScores) {
                const sortedScores = [...gameScores].sort((a, b) => 
                    (a.gameTotalTime || 0) - (b.gameTotalTime || 0)
                );
                setLeaderBoard(sortedScores);
            }
        } catch (err) {
            console.log('error fetching gameScoreByGameID', err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  LeaderBoard(): " + leaderBoardGameID);
        leaderBoardFunction("2021-04-01");
    }, [leaderBoardGameID]);

    return (
        <View>
            <Heading level={4} className="heading light">Game: {props.gameDetails.gameName}</Heading>
            <View className="small">Only games played the first time will show on leaderboard.</View>

            <Button className={showAllTimeButton ? "hide" : "button"} onClick={() => leaderBoardFunction(today.toLocaleDateString('en-CA'))}>
                tap to see today</Button>&nbsp;
            <Button className={showAllTimeButton ? "button" : "hide"} onClick={() => leaderBoardFunction("2021-04-01")}>
                tap to see all time</Button>
            <Heading level={3} className={showAllTimeButton ? "heading light" : "hide"} >Today</Heading>
            <Heading level={3} className={showAllTimeButton ? "hide" : "heading light"} >All Time</Heading>
            <div className="table-container" role="table" aria-label="Destinations">
                <div className="flex-table header" role="rowgroup">
                    <div className="flex-row first fourths" role="columnheader">Display Name</div>
                    <div className="flex-row fourths" role="columnheader">Rank</div>
                    <div className="flex-row fourths" role="columnheader">Team Score</div>
                    <div className="flex-row fourths" role="columnheader">Played</div>
                </div>
                {leaderBoard.map((game, index) => (
                    <div className="flex-table row" role="rowgroup" key={game.id}>
                        <div className="flex-row  fourths" role="cell">{game.teamName}</div>
                        <div className="flex-row fourths" role="cell">{Number(index) + 1}</div>
                        <div className="flex-row fourths" role="cell">{game.gameTotalTime} mins</div>
                        <div className="flex-row fourths" role="cell"> {format(new Date(game.createdAt), "MM/dd/yyyy H:mma")}</div>
                    </div>
                ))}
            </div>
        </View>
    );
}