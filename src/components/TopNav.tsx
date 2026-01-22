import {useContext, useState} from "react";
import {NavLink} from "react-router-dom";
import { Spin as Hamburger } from 'hamburger-react';
//import {removeLocalStorage} from "../helper";
import { MyAuthContext } from "../MyContext.tsx";
import Logo from "../assets/logo.svg?react";
import {ModalSlideFromRight} from './Modals.tsx';
import "../assets/css/modals.css";

/*
Added TypeScript types:
    ModalContent type - defines the structure with open: boolean and content: string
    TopNavProps type - defines the component props with proper types
    Function signature - now uses the typed props to eliminate the implicit any error
*/

type TopNavProps = {
  signOut: () => void;
};

export default function TopNav({signOut}: TopNavProps) {
    const context = useContext(MyAuthContext);
    const authStatus = context?.authStatus;
      /*console.log("authStatus (Home): " + authStatus);*/
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    const modalStyle: string = "mobile-nav";

    return (
        <header>
            <div className="nav-container">
                <div className="logo-height nav-item">
                    <NavLink to="/"><Logo width={250} height={51} /></NavLink>
                </div>
            <div className="nav-item">
                <nav className="navigation">
                    <ul>
                        <li>
                            <NavLink to="/game" className={({ isActive}) => isActive ? "active" : ""}>
                                Play Games
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/community" className={({ isActive}) => isActive ? "active" : ""}>
                                Community
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/howtoplay" className={({ isActive}) => isActive ? "active" : ""}>
                                How To Play
                            </NavLink>
                        </li>
                        <li className={authStatus=="authenticated" ? "" : "hide"}>
                            <NavLink to="/admin" className={({ isActive}) => isActive ? "active" : ""}>
                                Admin
                            </NavLink>
                        </li>

                        <li>
                            {authStatus !== "authenticated" ? (
                                <NavLink to="/login" className={({ isActive}) => isActive ? "active" : ""}>
                                    Sign in to Play
                                </NavLink>
                                ) : (
                                    <button  onClick={signOut}>Sign out</button>
                                )}
                        </li>


                    </ul>
                </nav>
                <div className="hamburger-container">
                    <Hamburger toggled={isOpen} toggle={toggleModal} color="#62dc01" />
                </div>
                {/* Mobile menu (always rendered for animation) */}
                <ModalSlideFromRight isOpen={isOpen} onClose={toggleModal} modalStyle={modalStyle}>
                    {/* Content of the mobile menu inside the modal */}
                    <nav className="mobile-menu">
                        <ul>
                            <li>
                                <NavLink to="/game" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                    Play Games
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/community" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                    Community
                                </NavLink>
                                <ul><li><a href={"#"} onClick={toggleModal}>build a game</a></li></ul>
                            </li>
                            <li>
                                <NavLink to="/howtoplay" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                    How To Play
                                </NavLink>
                            </li>
                            <li className={authStatus=="authenticated" ? "" : "hide"}>
                                <NavLink to="/admin" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                    Admin
                                </NavLink>
                            </li>

                            <li>
                                {authStatus !== "authenticated" ? (
                                    <NavLink to="/login" className={({ isActive}) => isActive ? "active" : ""} onClick={signOut}>
                                        Sign in to Play
                                    </NavLink>
                                ) : (
                                    <button  onClick={signOut}>Sign out</button>
                                )}
                            </li>


                        </ul>
                    </nav>
                </ModalSlideFromRight>


            </div>
            </div>
        </header>
    )
}