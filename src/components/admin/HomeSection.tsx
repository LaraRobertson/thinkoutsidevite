import React, {useEffect, useState} from 'react';
import { dataService } from '../../services/dataService';
import type { Schema } from '../../../amplify/data/resource';
import { format } from 'date-fns';

type UserPlayingNow = {
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
    }, []);

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
                    gameStates: { eq: '{"waiverSigned":true,"completed":true}' },
                    updatedAt: { gt: date }
                }
            });
            
            const usersPlayingNowArray: UserPlayingNow[] = [];
            
            for (const stat of gameStats.data) {
                const gameScores = await dataService.getClient().models.GameScore.list({
                    filter: { gameStatsID: { eq: stat.id } }
                });
                
                const completedScore = gameScores.data.find(score => score.completed);
                if (completedScore) {
                    usersPlayingNowArray.push({
                        id: usersPlayingNowArray.length,
                        userEmail: stat.userEmail,
                        gameName: stat.gameName,
                        gameStates: stat.gameStates || '',
                        city: stat.gameLocationCity || '',
                        createdAt: completedScore.createdAt || '',
                        updatedAt: completedScore.updatedAt || ''
                    });
                }
            }
            
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
            </div>
            <h6 style={{marginTop: '10px', marginBottom: '10px'}}>
                {showAllTimeButton ? "Today" : "All Time"}
            </h6>
            <div><hr /></div>
            {usersPlayingNow.map((user, index) => (
                <div key={index}>
                    {index+1}: email: {user.userEmail} | gameName: {user.gameName} <br />
                    city: {user.city} | gameStates: {user.gameStates}
                    <br /> createdAt: {format(new Date(user.createdAt), "MM/dd/yyyy H:mma")} | updatedAt: {format(new Date(user.updatedAt), "MM/dd/yyyy H:mma")}<br />
                <hr /></div>
            ))}
        </>
    )
}