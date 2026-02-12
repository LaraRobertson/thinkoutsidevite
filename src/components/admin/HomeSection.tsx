import {useEffect, useState} from 'react';
import { dataService } from '../../services/dataService';
import { format } from 'date-fns';
import {Button} from "@aws-amplify/ui-react";

type UserPlayingNow = {
  gameStatsID: string;
  id: number;
  userEmail: string;
  gameName: string;
  gameStates: string;
  city: string;
  updatedAt: string;
  createdAt: string;
};

export default function HomeSection() {
    const [showAllTimeButton, setShowAllTimeButton] = useState(true);
    const [usersPlayingNow, setUsersPlayingNow] = useState<UserPlayingNow[]>([]);
    const today = new Date();

    useEffect(() => {
        console.log("useeffect (fetchUserGamePlayNow) - date: " + today.toLocaleDateString('en-CA'));
        fetchUserGamePlayNow(today.toLocaleDateString('en-CA'));
        checkGameStatsData();
    }, []);

    async function checkGameStatsData() {
        try {
            const allStats = await dataService.getClient().models.GameStats.list();
            console.log("Total GameStats records:", allStats.data.length);
            console.log("GameStats data:", allStats.data);
        } catch (err) {
            console.log("Error checking GameStats:", err);
        }
    }

    async function deleteStat(props: { gameStatsID: string; }) {
        console.log("props.userID: " + props.gameStatsID);
        try {
            const client = dataService.getAuthClient();
            await client.models.GameStats.delete({ id: props.gameStatsID });
        } catch (err) {
            console.log('error deleting stat:', err);
        }
        fetchUserGamePlayNow("2021-04-01");
    }
    async function fetchUserGamePlayNowNotCompleted(date: string) {
        try {
            const gameStats = await dataService.getClient().models.GameStats.list({
                filter: {
                    gameStates: { eq: '{"waiverSigned":true}' },
                    updatedAt: { gt: date }
                }
            });
            
            const usersPlayingNowArray: UserPlayingNow[] = gameStats.data.map((stat, i) => ({
                id: i,
                gameStatsID: stat.id || '',
                userEmail: stat.userEmail,
                gameName: stat.gameName,
                gameStates: stat.gameStates || '',
                city: stat.gameLocationCity || '',
                updatedAt: stat.updatedAt || '',
                createdAt: stat.createdAt || ''
            }));
            
            setUsersPlayingNow(usersPlayingNowArray);
        } catch (err) {
            console.log("error fetching GameStats:", err);
        }
    }

    async function fetchUserGamePlayNow(date: string) {
        try {
            const gameStats = await dataService.getClient().models.GameStats.list({
                filter: {
                    /*gameStates: { eq: '{"waiverSigned":true,"completed":true}' },*/
                    updatedAt: { gt: date }
                }
            });
            
            console.log("Filtered GameStats count:", gameStats.data.length);
            
            const usersPlayingNowArray: UserPlayingNow[] = [];
            
            for (const stat of gameStats.data) {
                const gameScores = await dataService.getClient().models.GameScore.list({
                    filter: { gameStatsID: { eq: stat.id } }
                });
                
                console.log(`GameScores for ${stat.userEmail}:`, gameScores.data);
                
                const completedScore = gameScores.data.find(score => score.completed);
                if (completedScore) {
                    usersPlayingNowArray.push({
                        id: usersPlayingNowArray.length,
                        userEmail: stat.userEmail,
                        gameName: stat.gameName,
                        gameStates: stat.gameStates || '',
                        city: stat.gameLocationCity || '',
                        createdAt: completedScore.createdAt || '',
                        updatedAt: completedScore.updatedAt || '',
                        gameStatsID: stat.id || ''
                    });
                } else {
                    console.log(`No completed score found for ${stat.userEmail}`);
                }
            }
            
            console.log("Final usersPlayingNowArray:", usersPlayingNowArray);
            setUsersPlayingNow(usersPlayingNowArray);
        } catch (err) {
            console.log("error fetching GameStats:", err);
        }
    }

    async function fetchUserGamePlayAll() {
        try {
            const gameStats = await dataService.getClient().models.GameStats.list();

            const usersPlayingNowArray: UserPlayingNow[] = gameStats.data.map((stat, i) => ({
                id: i,
                gameStatsID: stat.id || '',
                userEmail: stat.userEmail,
                gameName: stat.gameName,
                gameStates: stat.gameStates || '',
                city: stat.gameLocationCity || '',
                updatedAt: stat.updatedAt || '',
                createdAt: stat.createdAt || ''
            }));

            setUsersPlayingNow(usersPlayingNowArray);
        } catch (err) {
            console.log("error fetching GameStats:", err);
        }
    }
    return (
        <>
            <h1>Dashboard</h1>

            <div>
                <button 
                    className={showAllTimeButton ? "" : "hide"}
                    onClick={() => {
                        fetchUserGamePlayNow("2021-04-01");
                        setShowAllTimeButton(false);
                    }}
                >
                    show all time
                </button>
                <button 
                    className={showAllTimeButton ? "hide" : ""}
                    onClick={() => {
                        fetchUserGamePlayNow(today.toLocaleDateString('en-CA'));
                        setShowAllTimeButton(true);
                    }}
                >
                    show today
                </button>
                <button
                    onClick={() => {
                        fetchUserGamePlayNowNotCompleted(today.toLocaleDateString('en-CA'));
                    }}
                >
                    playing now
                </button>
                <button
                    onClick={() => {
                        fetchUserGamePlayAll();
                    }}
                >
                    all gameStats
                </button>
            </div>
            <h6 style={{marginTop: '10px', marginBottom: '10px'}}>
                {showAllTimeButton ? "Today" : "All Time"}
            </h6>
            <div><hr /></div>
            {usersPlayingNow.map((user, index) => (
                <div key={index} className={(index % 2 === 0 ? "flex-table-row light" : "flex-table-row dark")}>
                    <div><strong>{index+1}</strong>:</div>
                    <div><strong>email</strong>: {user.userEmail} </div>
                    <div><strong>gameName</strong>: {user.gameName}</div>
                    <div><strong>city</strong>: {user.city} </div>
                    <div><strong>gameStates</strong>: {user.gameStates}</div>
                    <div><strong>createdAt</strong>: {format(new Date(user.createdAt), "MM/dd/yyyy H:mma")}</div>
                    <div><strong>updatedAt</strong>: {format(new Date(user.updatedAt), "MM/dd/yyyy H:mma")}</div>
                     <Button className="button"
                              onClick={() => deleteStat({"gameStatsID": user.gameStatsID})}>Delete Stat</Button></div>
            ))}
        </>
    )
}