// components/Modals.tsx
import React, { useEffect, ReactNode, useContext } from 'react';
import ReactDOM, {createPortal} from 'react-dom';
import {Button, Heading, View} from "@aws-amplify/ui-react";
import {MyAuthContext} from "../MyContext";
import "../assets/css/modals.css";
import {getDefaultModalContent} from "../utils/modalHelpers.ts";

interface ModalPropsFromRight {
    isOpen: boolean;
    onClose: () => void;
    modalStyle?: string;
    children: ReactNode;
}
interface ModalProps{
    isOpen: boolean;
    children: ReactNode;
}
type ModalContentMap = {
    open: boolean;
    content: string;
};
interface ModalPropsMap{
    isOpen: boolean;
    setModalContentMap: React.Dispatch<React.SetStateAction<ModalContentMap>>;
    children: ReactNode;
}

export const ModalSlideFromRight: React.FC<ModalPropsFromRight> = ({ isOpen, onClose, modalStyle, children }) => {
    /* this is basically used for nav modal - isOpen, onClose, modalStyle are not set in modalContent but are set in function
    * because both the hamburger icon and nav open at the same time but could be changed...
     */
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className={`modal-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
            <div className={`modal-content-right ${modalStyle || ''} ${isOpen ? 'slide-from-right' : ''}`}
                 role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
            {children}
            <button className={`modal-close-button ${modalStyle}`} onClick={onClose} aria-label="Close menu">
                &times;
            </button>
            </div>
        </div>,
        document.body
    );
};

export const ModalSlideFromBottom: React.FC<ModalProps> = ({ children }) => {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;

    function onClose() {
        console.log('close modal');
        setModalContent(getDefaultModalContent());
    }
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className={`modal-overlay ${modalContent.open ? 'is-open' : ''}`} onClick={onClose}>
            <div className={`modal-content-bottom ${modalContent.modalStyle || ''} ${modalContent.open ? 'slide-from-bottom' : ''}`}
                 role="dialog"
                 aria-modal="true"
                 onClick={(e) => e.stopPropagation()}
            >
                {children}
                <button className={`modal-close-button ${modalContent.modalStyle}`} onClick={onClose} aria-label="Close menu">
                    &times;
                </button>
            </div>
        </div>,
        document.body
    );
};

export const ModalMap: React.FC<ModalPropsMap> = ({ isOpen, setModalContentMap, children }) => {
    function onClose() {
        setModalContentMap({ open: false, content: ""});
    }
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className={`modal-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
            <div className={`modal-content-map  game-details ${isOpen ? 'slide-from-right' : ''}`}
                 role="dialog"
                 aria-modal="true"
                 onClick={(e) => e.stopPropagation()}
            >
                {children}
                <button className={`modal-close-button game-details`} onClick={onClose} aria-label="Close menu">
                    &times;
                </button>
            </div>
        </div>,
        document.body
    );
};

export function ReactModalFromRight({isOpen, children}: {isOpen: boolean; children: ReactNode}) {
    console.log("ReactModalFromRight");
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;

    function onClose() {
       setModalContent({ open: false, content: "", id: "", modalStyle: "", action: "", gameID: "", zoneID: "", puzzleID: "",updatedDB: false })
    }
    
    if (!modalContent?.open) return null;
    
    return createPortal(
        <div className={`modal-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
            <div 
                className="modalContent adminModal"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <View className={"modal-top-bar"}>
                    <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                    <Button className="close-button-modal light" onClick={onClose}>X</Button>
                </View>
                {children}
                <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                    <Button className="close light" onClick={onClose}>close</Button>
                </View>
            </div>
        </div>,
        document.getElementById("modal") || document.body
    );
}

interface ModalWaiverProps {
    isOpen: boolean;
    setModalContentWaiver: (content: {show: boolean; content: string}) => void;
    children: ReactNode;
}

export function ModalWaiver({isOpen, setModalContentWaiver, children}: ModalWaiverProps) {

    function close() {
        setModalContentWaiver({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${isOpen ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal background-dark game-intro from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Waiver</h2>

                        </header>
                        <div className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </div>
                        <footer className="modal_footer">

                        </footer>
                        <button className={`modal-close-button`} onClick={close} aria-label="Close menu">
                            &times;
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

interface ModalGameIntroProps {
    modalContentGI: {show: boolean; content: string};
    setModalContentGI: (content: {show: boolean; content: string}) => void;
    handlePlayGameIntro: () => void;
    children: ReactNode;
}
export function ModalGameIntro({modalContentGI,setModalContentGI, handlePlayGameIntro, children}: ModalGameIntroProps) {

    function close() {
        setModalContentGI({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalContentGI.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal background-dark game-intro from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Are You Ready?</h2>

                        </header>
                        <div className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </div>
                        <footer className="modal_footer">
                            <Button margin="0 0 0 0" className="button"
                                    onClick={() => {
                                        handlePlayGameIntro();
                                    }}>PLAY - Time Starts</Button>
                        </footer>
                        <button className={`modal-close-button`} onClick={close} aria-label="Close menu">
                            X
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

interface ModalPuzzleProps {
    modalPuzzleContent: {show: boolean; content: string};
    setModalPuzzleContent: (content: {show: boolean; content: string}) => void;
    gamePuzzleDetails: {puzzleName?: string};
    children: ReactNode;
}

export function ModalPuzzle({modalPuzzleContent,setModalPuzzleContent,gamePuzzleDetails,children}: ModalPuzzleProps) {
    const context = useContext(MyAuthContext);
    if (!context) return null;
    const { isChecked } = context;
    function close() {
        setModalPuzzleContent({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalPuzzleContent.show ? "showModal puzzleModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal background-dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">{gamePuzzleDetails.puzzleName}</h2>
                            <button className="close" onClick={() => close()}>
                                X
                            </button>
                        </header>
                        <main className="modal_content">
                            <div className={isChecked? "background-dark" : "background-light"}>
                                {children}
                            </div>
                        </main>
                        <footer className="modal_footer">
                            <button className="modal-close" onClick={() => close()}>
                                close
                            </button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal") || document.body
            )}
        </>
    )
}

interface ModalWinnerProps {
    showWinner: boolean;
    setShowWinner: (show: boolean) => void;
    children: ReactNode;
}

export function ModalWinner({showWinner, setShowWinner, children}: ModalWinnerProps) {
    function close() {
        setShowWinner(false);
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${showWinner ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal background-light from-left" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Winner!</h2>
                            <button className="close" onClick={() => close()}>
                                close
                            </button>
                        </header>
                        <main className="modal_content background-light">
                            <View className={"background-light"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <button className="modal-close" onClick={() => close()}>
                                close
                            </button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal") || document.body
            )}
        </>
    )
}
