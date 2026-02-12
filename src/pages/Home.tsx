import Hero from "../components/home/Hero";
import GameList from "../components/home/GameList";
import GameDetail from "../components/home/modalContent/GameDetail";
import GameIntro from "../components/home/modalContent/GameIntro";
import Waiver from "../components/home/modalContent/Waiver";
import LeaderBoard from "../components/home/modalContent/LeaderBoard";
import MyStats from "../components/home/modalContent/MyStats";
import { MyAuthContext } from '../MyContext';
import {ModalSlideFromBottom} from '../components/Modals.tsx';

import type {GameDetails} from "../types/game.ts";
import {useContext, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {useAuthenticator} from '@aws-amplify/ui-react';
import { dataService } from "../services/dataService";


export default function Home() {
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [gamesIDUserPlayed, setGamesIDUserPlayed] = useState<string[]>([]);
  const [gamesIDUser, setGamesIDUser] = useState<string[]>([]);
  const [hideIntro, setHideIntro] = useState(false)
  const checkedEmailRef = useRef<string | null>(null);
    const location = useLocation()
    const { user } = useAuthenticator((context) => [context.user]);


    useEffect(() => {
        if (!user) return;
        
        async function fetchUserPlayedGames() {
            if (!user?.signInDetails?.loginId) return;
            
            const userEmail = user.signInDetails.loginId;
            console.log("Fetching played games for email:", userEmail);
            
            try {
                const client = dataService.getClient();
                
                // Get User record to get userID
                const { data: users } = await client.models.User.list({
                    filter: { email: { eq: userEmail } }
                });
                
                if (!users || users.length === 0) return;
                
                const userID = users[0].id;
                
                // Fetch UserGamePlay to get games user can play
                const { data: userGamePlays } = await client.models.UserGamePlay.list({
                    filter: { userId: { eq: userID } },
                    selectionSet: ['gameId']
                });
                
                if (userGamePlays) {
                    const canPlayGameIDs = userGamePlays.map(ugp => ugp.gameId).filter(Boolean) as string[];
                    setGamesIDUser(canPlayGameIDs);
                    console.log("Can play games IDs:", canPlayGameIDs);
                }
                
                // Fetch GameStats by userEmail to get games user has played
                const { data: gameStats } = await client.models.GameStats.list({
                    filter: { userEmail: { eq: userEmail } },
                    selectionSet: ['gameID']
                });
                
                console.log("GameStats found:", gameStats);
                
                if (gameStats) {
                    const playedGameIDs = gameStats.map(stat => stat.gameID).filter(Boolean) as string[];
                    setGamesIDUserPlayed(playedGameIDs);
                    console.log("Played games IDs:", playedGameIDs);
                }
            } catch (err) {
                console.log('Error fetching user played games:', err);
            }
        }
        
        fetchUserPlayedGames();
    }, [user]);


    useEffect(() => {
        /* if route is admin or game set hideNav to true */
        console.log("current path", JSON.stringify(location));
        if (location.hash.includes('playgames')) {
            setHideIntro(true);
            console.log("hideIntro is true");
        } else {
            setHideIntro(false);
        }
    }, [location.hash]);

    useEffect(() => {
        if (!user) return;
        
        async function checkAndCreateUser() {
            if (!user?.signInDetails?.loginId) return;
            
            const userEmail = user.signInDetails.loginId;
            
            if (checkedEmailRef.current === userEmail) return;
            
            console.log("Checking for user email:", userEmail);
            localStorage.setItem("email", userEmail);
            
            try {
                const client = dataService.getClient();
                const { data: existingUsers } = await client.models.User.list({
                    filter: { email: { eq: userEmail } }
                });
                
                if (!existingUsers || existingUsers.length === 0) {
                    console.log("Creating new user with email:", userEmail);
                    await dataService.createUser(userEmail);
                } else {
                    console.log("User already exists, skipping creation");
                }
            } catch (err) {
                console.log('Error checking/creating user:', err);
            }
            
            checkedEmailRef.current = userEmail;
        }
        
        checkAndCreateUser();
    }, [user]);


    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { modalContent } = context;

    return (
      <>
        <section className={hideIntro? "hide" : "main-container background-dark"}>
            <Hero />
        </section>
        <section className={"main-container background-dark"}>
            <div className={"main-content"}>
                <GameList setGameDetails={setGameDetails} gamesIDUserPlayed={gamesIDUserPlayed} gamesIDUser={gamesIDUser}/>
                <ModalSlideFromBottom isOpen={modalContent.open} >
                    {(modalContent.content == "Game Detail" && gameDetails) && <GameDetail gameDetails={gameDetails} />}
                    {(modalContent.content == "Game Intro" && gameDetails) && <GameIntro gameDetails={gameDetails} setGameDetails={setGameDetails} />}
                    {(modalContent.content == "Waiver" && gameDetails) && <Waiver gameDetails={gameDetails} setGameDetails={setGameDetails} gameIntro={false}/>}
                    {(modalContent.content == "Leaderboard" && gameDetails) && <LeaderBoard gameDetails={gameDetails}/>}
                    {(modalContent.content == "My Stats") && <MyStats /> }
                </ModalSlideFromBottom>

            </div>
        </section>
      </>
  );
}