/* Admin.tsx */
import AdminNav from "../components/admin/AdminNav";
import AdminHeading from "../components/admin/AdminHeading";
import "../assets/css/admin.css";
import {useContext} from "react";
import {Outlet} from "react-router-dom";
import { MyAuthContext } from "../MyContext.tsx";
import {ReactModalFromRight} from "../components/Modals";
import GameForm from "../components/admin/modalContent/GameForm.tsx";
import ZoneForm from "../components/admin/modalContent/ZoneForm.tsx";
import PuzzleForm from "../components/admin/modalContent/PuzzleForm.tsx";
import TextFieldForm from "../components/admin/modalContent/TextFieldForm.tsx";
import ClueForm from "../components/admin/modalContent/ClueForm.tsx";
import HintForm from "../components/admin/modalContent/HintForm.tsx";
import GameStats from "../components/admin/modalContent/GameStats.tsx";
import UserStats from "../components/admin/modalContent/UserStats.tsx";
import CityForm from "../components/admin/modalContent/CityForm.tsx";
import GameSelectForm from "../components/admin/modalContent/GameSelectForm.tsx";


export default function Admin() {
  const context = useContext(MyAuthContext);
  if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
  const { modalContent } = context;
  const email = context?.user?.signInDetails?.loginId;
  console.log('App modalContent:', modalContent);
  return (
    <>
      <div className="main-container-admin background-light">
        <AdminNav />
        <div className="admin">
          <AdminHeading userName={email || ''} />
          <div>

            <Outlet />

            <ReactModalFromRight isOpen={modalContent.open}>
              {(modalContent.content === "Game Form") && <GameForm  />}
              {(modalContent.content === "Stats") && <GameStats />}
              {(modalContent.content === "Zone Form") && <ZoneForm />}
              {(modalContent.content === "Puzzle Form") && <PuzzleForm />}
              {(modalContent.content === "TextField Form") && <TextFieldForm />}
              {(modalContent.content === "Clue Form") && <ClueForm />}
              {(modalContent.content === "Hint Form") && <HintForm />}
              {(modalContent.content === "User Stats") && <UserStats />}
              {(modalContent.content === "City Form") && <CityForm />}
              {(modalContent.content === "Game Select") && <GameSelectForm />}
            </ReactModalFromRight>
          </div>
        </div>
      </div>
    </>
  )
}