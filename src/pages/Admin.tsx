/* Admin.tsx */
import AdminNav from "../components/admin/AdminNav";
import AdminHeading from "../components/admin/AdminHeading";
import HomeSection from "../components/admin/HomeSection.tsx"
import UserSection from "../components/admin/UserSection";
import GameSection from "../components/admin/GameSection";
import "../assets/css/admin.css";
import {useContext, useState} from "react";
import {Outlet} from "react-router-dom";
import { MyAuthContext } from "../MyContext.tsx";
import {ReactModalFromRight} from "../components/Modals";
import GameForm from "../components/admin/GameForm";
import ZoneForm from "../components/admin/ZoneForm";
import PuzzleForm from "../components/admin/PuzzleForm";
import TextFieldForm from "../components/admin/TextFieldForm";
import ClueForm from "../components/admin/ClueForm";
import HintForm from "../components/admin/HintForm";
import GameStats from "../components/admin/GameStats";
import UserStats from "../components/admin/UserStats";
import CityForm from "../components/admin/CityForm";


export default function Admin() {
  const context = useContext(MyAuthContext);
  const email = context?.user?.signInDetails?.loginId;
  const [modalContent, setModalContent] = useState({open:false, content:"",id:"",action:"", gameID:"",zoneID:"",updatedDB:false});
  const [formCreateGameStateBackup, setFormCreateGameStateBackup] = useState<{gameName: string}>({gameName: "New"});

  console.log('Admin modalContent:', modalContent);

  const initialStateDisplaySection = {
    gameSection: false,
    userSection: false,
    adminSection: false,
    homeSection: false,
  };
  const [displaySection, setDisplaySection] = useState(initialStateDisplaySection);
  return (
    <MyAuthContext.Provider value={{ ...context, modalContent, setModalContent }}>
      <div className="main-container-admin">
        <AdminNav displaySection={displaySection} setDisplaySection={setDisplaySection}/>
        <div className="admin">
          <AdminHeading userName={email} displaySection={displaySection} setDisplaySection={setDisplaySection}/>
          <div>

            <Outlet />

            <ReactModalFromRight modalContent={modalContent}>
              {modalContent.open && console.log('Modal should open with:', modalContent.content)}
              {(modalContent.content === "Game Form") && <GameForm  setFormCreateGameStateBackup={setFormCreateGameStateBackup} />}
              {(modalContent.content === "Stats") && <GameStats modalContent={modalContent} />}
              {(modalContent.content === "Zone Form") && <ZoneForm formCreateGameStateBakcup={formCreateGameStateBackup}/>}
              {(modalContent.content === "Puzzle Form") && <PuzzleForm formCreateGameStateBackup={formCreateGameStateBackup}/>}
              {(modalContent.content === "TextField Form") && <TextFieldForm />}
              {(modalContent.content === "Clue Form") && <ClueForm />}
              {(modalContent.content === "Hint Form") && <HintForm />}
              {(modalContent.content === "User Stats") && <UserStats />}
              {(modalContent.content === "City Form") && <CityForm />}
            </ReactModalFromRight>
          </div>
        </div>
      </div>
    </MyAuthContext.Provider>
  )
}