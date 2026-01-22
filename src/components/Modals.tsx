// components/Modals.tsx
import React, { useEffect, ReactNode, useContext } from 'react';
import ReactDOM, {createPortal} from 'react-dom';
import {Button, Heading, View} from "@aws-amplify/ui-react";
import {MyAuthContext, MyGameContext} from "../MyContext";
import "../assets/css/modals.css";

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
            <div className={`modal-content-right ${modalStyle} ${isOpen ? `slide-from-right || ''}` : ''}`}
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

export const ModalSlideFromBottom: React.FC<ModalProps> = ({ isOpen, children }) => {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent, modalContent } = context;

    function onClose() {
        setModalContent({ open: false, content: "", id: "", modalStyle: "", action: "", gameID: "", zoneID: "", updatedDB: false });
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
            <div className={`modal-content-bottom ${modalContent.modalStyle} ${isOpen ? `slide-from-bottom || ''}` : ''}`}
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
            <div className={`modal-content-map  game-details ${isOpen ? `slide-from-right || ''}` : ''}`}
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
export function ReactModal({modalContent, children}: {modalContent: any; children: ReactNode}) {
    console.log("ReactModal");
    let mapClass="";
    if (modalContent.content === "Map" || modalContent.content === "MapPlaceView") mapClass="-Map";
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSection must be used within MyAuthContext.Provider");
    const { setModalContent } = context;
    
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    
    if (!modalContent.open) return null;
    
    return createPortal(
        <div className="modal-overlay is-open" onClick={closeModal}>
            <div 
                className={"modalContent" + mapClass}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <View className={"modal-top-bar"}>
                    <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                    <Button className="close-button-modal light" onClick={closeModal}>X</Button>
                </View>
                {children}
                <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                    <Button className="close light" onClick={closeModal}>close</Button>
                </View>
            </div>
        </div>,
        document.getElementById("modal") || document.body
    );
}

export function ReactModalsFromRight({modalContent, children}: {modalContent: any; children: ReactNode}) {
    const { setModalContent } = useContext(MyAuthContext);

    function closeModal() {
        setModalContent({open:false,content:""});
    }

    if (!modalContent.open) return null;

    return createPortal(
        <div className="modal-overlay is-open" onClick={closeModal}>
            <div
                className="modal-content-right"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <View className={"modal-top-bar"}>
                    <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                    <Button className="close-button-modal light" onClick={closeModal}>X</Button>
                </View>
                {children}
                <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                    <Button className="close light" onClick={closeModal}>close</Button>
                </View>
            </div>
        </div>,
        document.getElementById("modal") || document.body
    );
}

export function ReactModalFromRight({modalContent, children}: {modalContent: any; children: ReactNode}) {
    console.log("ReactModalFromRight", modalContent);
    const context = useContext(MyAuthContext);
    const setModalContent = context?.setModalContent;
    
    function closeModal() {
        if (setModalContent) {
            setModalContent({open:false, content:"", id:"", action:"", gameID:"", zoneID:"", updatedDB:false});
        }
    }
    
    if (!modalContent?.open) return null;
    
    return createPortal(
        <div className="modal-overlay is-open" onClick={closeModal}>
            <div 
                className="modalContent adminModal"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <View className={"modal-top-bar"}>
                    <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContent.content}</Heading>
                    <Button className="close-button-modal light" onClick={closeModal}>X</Button>
                </View>
                {children}
                <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                    <Button className="close light" onClick={closeModal}>close</Button>
                </View>
            </div>
        </div>,
        document.getElementById("modal") || document.body
    );
}
export function ReactModalFromBottomMap({modalContentMap, setModalContentMap, children}) {
    console.log("ReactModalFromBottomGI: " + modalContentMap.open);
    let mapClass="";
    if (modalContentMap.content === "Map") mapClass="-Map";
    Modal.setAppElement("#modal");
    function closeModal() {
        setModalContentMap({open:false,content:""});
    }
    return (
        <>
            {createPortal(<Modal
                    closeTimeoutMS={200}
                    isOpen={modalContentMap.open}
                    onRequestClose={closeModal}
                    className={"modalContent" + mapClass}
                    contentLabel={"General"}
                    overlayClassName={"slide-from-bottom"}
                    parentSelector={() => document.querySelector("#modal")}
                    preventScroll={
                        false
                        /* Boolean indicating if the modal should use the preventScroll flag when
                           restoring focus to the element that had focus prior to its display. */}
                >
                    <View className={"modal-top-bar"}>
                        <Heading level={4} marginBottom="10px" className={"modal-header"}>{modalContentMap.content}</Heading>
                        <Button className="close-button-modal light"
                                onClick={closeModal}>X</Button>
                    </View>
                    {children}

                    <View className="modal-from-top-close" textAlign={"center"} width={"100%"}>
                        <Button className="close light" onClick={closeModal}>close</Button>
                    </View>
                </Modal>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ModalGameIntro({modalContentGI,setModalContentGI, handlePlayGameIntro, children}) {
    /*const { isChecked } = useContext(MyGameContext);*/
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
                    <div className="modal background-dark  from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Are You Ready?</h2>
                            <button className={`modal-close-button`} onClick={close} aria-label="Close menu">
                                &times;
                            </button>
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
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export function ModalPuzzle({modalPuzzleContent,setModalPuzzleContent,puzzleDetails,children}) {
    const { isChecked } = useContext(MyGameContext);
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
                    <div className="modal dark from-right" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">{puzzleDetails.puzzleName}</h2>
                            <button className="close" onClick={() => close()}>
                                close
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={isChecked? "dark" : "light"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <button className="modal-close" onClick={() => close()}>
                                Close
                            </button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ModalClue({modalClueContent,setModalClueContent,clueDetails,setCluesFunction,children}) {
    const { isChecked } = useContext(MyGameContext);
    function close() {
        setModalClueContent({show:false,content:""});
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${modalClueContent.show ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-left" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">{clueDetails.gameClueName}</h2>
                            <button className="close" onClick={() => close()}>
                                close
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <button className="submit" className={"add-clue"} onClick={()=>
                            {setCluesFunction(clueDetails.gameClueName,clueDetails.gameClueText,clueDetails.gameClueID,clueDetails.gameClueImage);close();
                            }}>add clue to notes</button>
                            <button className="modal-close" onClick={() => close()}>
                                Close
                            </button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}

export function ReactModalWinner({gameTimeTotal,children}) {
    const { isChecked } = useContext(MyGameContext);
    let openModal = false;
    if (gameTimeTotal > 0) openModal = true;
    function close() {
        openModal = false;
    }
    return (
        <>
            {createPortal(
                <div
                    className={`modalContainer ${openModal ? "showModal" : ""} `}
                    onClick={() => close()}
                >
                    <div className="modal dark from-left" onClick={(e) => e.stopPropagation()}>
                        <header className="modal_header">
                            <h2 className="modal_header-clueDetails">Winner1</h2>
                            <button className="close" onClick={() => close()}>
                                close
                            </button>
                        </header>
                        <main className="modal_content">
                            <View className={"dark"}>
                                {children}
                            </View>
                        </main>
                        <footer className="modal_footer">
                            <button className="submit" className={"add-clue"} onClick={()=>
                            {setCluesFunction(clueDetails.gameClueName,clueDetails.gameClueText,clueDetails.gameClueID,clueDetails.gameClueImage);close();
                            }}>add clue to notes</button>
                            <button className="modal-close" onClick={() => close()}>
                                Close
                            </button>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal")
            )}
        </>
    )
}
