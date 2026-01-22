import { useHomeData } from "../hooks/useHomeData";
import Hero from "../components/home/Hero";
import GameList from "../components/home/GameList";
import GameDetail from "../components/home/modalContent/GameDetail";
import GameIntro from "../components/home/modalContent/GameIntro";
import Waiver from "../components/home/modalContent/Waiver";
import { MyAuthContext } from '../MyContext';
import {ModalSlideFromBottom} from '../components/Modals.tsx';

import type {GameDetails} from "../types/game.ts";
import {useContext, useState} from "react";


export default function Home() {
  const { todos, users, error, loading, creating, deleting, createTodo, createUser, deleteTodo, isAuthenticated } = useHomeData();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);

  const context = useContext(MyAuthContext);
  if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
  const { setModalContent, modalContent } = context;

  if (loading) return <div>Loading...</div>;

  return (
      <>
        <section className={"main-container"}>
            <Hero />
        </section>
        <section className={"main-container"}>
            <div className={"main-content"}>
            {error && <div style={{color: 'red', padding: '10px'}}>{error}</div>}
                <GameList setGameDetails={setGameDetails} />
                <ModalSlideFromBottom isOpen={modalContent.open} >
                    {(modalContent.content == "Game Detail") && <GameDetail gameDetails={gameDetails} />}
                    {(modalContent.content == "Game Intro") && <GameIntro gameDetails={gameDetails} />}
                    {(modalContent.content == "Waiver") && <Waiver gameDetails={gameDetails} setGameDetails={setGameDetails} gameIntro={false}/>}

                </ModalSlideFromBottom>

            </div>
        </section>
      </>
  );
}