import {useContext, useState} from "react";
import {NavLink} from "react-router-dom";
import { Spin as Hamburger } from 'hamburger-react';
import { MyAuthContext } from "../MyContext.tsx";

import {ModalSlideFromRight} from "./Modals.tsx";
import Logo from "../assets/icons/logo.svg?react";

interface NavContainerProps {
    signOut: () => void;
    footer: boolean;
}

export default function NavContainer(props: NavContainerProps) {
    const { signOut, footer } = props;
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!isOpen);
    }
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("TopNav must be used within MyAuthContext.Provider");
    const {authStatus, user} = context;
    const modalStyle: string = "mobile-nav";
return (
    <div className="nav-container">
        <div className="logo-height nav-item">
            <NavLink to="/"><Logo width={250} height={51} /></NavLink>
        </div>
        <div className="nav-item">
            <nav className={footer? "navigation footer" : "navigation"}>
                <ul>
                    <li>
                        <NavLink to="/#playgames" className={({ isActive}) => isActive ? "active" : ""}>
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
                    <li className={(authStatus=="authenticated" && user?.signInDetails?.loginId === "lararobertson70@gmail.com") ? "" : "hide"}>
                        <NavLink to="/admin" className={({ isActive}) => isActive ? "active" : ""}>
                            Admin
                        </NavLink>
                    </li>
                    {!footer &&
                    <li>
                        {authStatus !== "authenticated" ? (
                            <NavLink to="/login" className={({ isActive}) => isActive ? "active" : ""}>
                                Sign in to Play
                            </NavLink>
                        ) : (
                            <button  onClick={signOut}>Sign out</button>
                        )}
                    </li>}


                </ul>
            </nav>
            {!footer && <div className="hamburger-container">
                <Hamburger toggled={isOpen} toggle={toggleModal} color="#62dc01" />
            </div>}
            {/* Mobile menu (always rendered for animation) */}
            <ModalSlideFromRight isOpen={isOpen} onClose={toggleModal} modalStyle={modalStyle}>
                {/* Content of the mobile menu inside the modal */}
                <nav className="mobile-menu">
                    <ul>
                        <li>
                            <NavLink to="/#playgames" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                Play Games
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/community" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                Community
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/howtoplay" className={({ isActive}) => isActive ? "active" : ""} onClick={toggleModal}>
                                How To Play
                            </NavLink>
                        </li>
                        <li className={(authStatus=="authenticated" && user?.signInDetails?.loginId === "lararobertson70@gmail.com") ? "" : "hide"}>
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
)
}