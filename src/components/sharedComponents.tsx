import {Button, Image, TextAreaField, View, Flex, Icon} from "@aws-amplify/ui-react";
import React from "react";
import {
    toggleNotes,
    setCommentsFunction,
    goHome
} from "./helper";
import {useNavigate, NavigateFunction} from "react-router-dom";
import DOMPurify from "dompurify";
import diary from "../assets/noun-diary-6966311.svg";
import tornPaper from "../assets/noun-torn-paper-3017230.svg";
import messageInABottle from "../assets/noun-message-in-a-bottle-5712014.svg";
import clueIcon from "../assets/noun-clue-4353248.svg";
import clueNoteIcon from "../assets/noun-note-question-1648398.svg";
import envelope from "../assets/noun-message-6963433.svg";

interface NotAvailableProps {
    authStatus: string;
}

interface TimeBlockProps {
    realTimeStart: string;
    gameTimeHint: number;
    isHelpVisible: boolean;
    setIsHelpVisible: (visible: boolean) => void;
    areNotesVisible: boolean;
    setAreNotesVisible: (visible: boolean) => void;
}

interface CommentWindowProps {
    gameComments: string;
    setGameComments: (comments: string) => void;
}

interface IconClueDisplayProps {
    gameClueIcon: string;
    hide?: string;
}

interface ClueItem {
    gameClueID: string;
    gameClueName: string;
    gameClueText: string;
    gameClueImage: string;
}

interface NotesOpenProps {
    cluesArray: ClueItem[];
    setCluesArrayRemoveFunction: (index: number) => void;
    isChecked: boolean;
    clues: string;
    gameNotes: string;
    setGameNotesFunction: (notes: string, setter: (notes: string) => void) => void;
    setGameNotes: (notes: string) => void;
    setCluesArray: (clues: ClueItem[]) => void;
}

export const NotAvailable: React.FC<NotAvailableProps> = ({ authStatus }) => {
    const navigate = useNavigate();
    return (
        <View>
            {authStatus === "configuring" ?
                (<View>Loading</View>) : (
                    <View>
                        <View textAlign="center">Admin is not available</View>
                        <Flex justifyContent="center">
                            <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                        </Flex>
                    </View>
                )}
        </View>
    )
}

export const GreenIcon: React.FC = () => {
    return (
        <Icon
            height="20px"
            width="20px"
            ariaLabel="CheckMark"
            viewBox={{ minX: 0, minY: 0, width: 500, height: 500 }}
            paths={[
                {
                    d: "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z",
                    fill: "#6c4",
                },
            ]}
        />
    )
}

function toggleHelp(isHelpVisible: boolean, setIsHelpVisible: (visible: boolean) => void) {
    setIsHelpVisible(!isHelpVisible);
}

export const TimeBlock: React.FC<TimeBlockProps> = (props) => {
    console.log("props.realTimeStart: " + props.realTimeStart);
    let realTimeStart = new Date(props.realTimeStart).toLocaleString();
    return (
        <View aria-label="stop 1 Time" className="time">
            <View className="small">hint time: {props.gameTimeHint} mins | time started: {realTimeStart} </View>
            <Button onClick={() => toggleHelp(props.isHelpVisible, props.setIsHelpVisible)}>Help</Button>
            <Button onClick={() => toggleNotes(props.areNotesVisible, props.setAreNotesVisible, false, () => {})}>Notes</Button>
        </View>
    )
}

export const CommentWindow: React.FC<CommentWindowProps> = (props) => {
    const navigate = useNavigate();
    return (
        <View className="cover-screen">
            <View className="winner comment-screen">
                <h3>Thank you for playing. </h3>
                We really want to know any and all comments you have about the game.
                <TextAreaField
                    rows={6}
                    onChange={(e) => setCommentsFunction(e.currentTarget.value, props.setGameComments)}
                    descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                /><br />
                <Button className="button small" onClick={() => goHome(navigate, props.gameComments)}>Back to Games Page</Button>
            </View>
        </View>
    )
}

function DangerouslySetInnerHTMLSanitized(htmlContent: string): string {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    return sanitizedHtmlContent;
}

export const IconClueDisplay: React.FC<IconClueDisplayProps> = ({ gameClueIcon }) => {
    console.log("props.gameClueIcon: " + gameClueIcon);
    if (gameClueIcon !== "") {
        switch (gameClueIcon) {
            case "diary":
                return <Image height="70px" width="70px" src={diary} alt="diary" />;
            case "tornPaper":
                return <Image height="70px" width="70px" src={tornPaper} alt="torn paper" />;
            case "messageInABottle":
                return <Image height="70px" width="70px" src={messageInABottle} alt="message in a bottle" />;
            case "clueIcon":
                return <Image height="70px" width="70px" src={clueIcon} alt="clue icon" />;
            case "clueNoteIcon":
                return <Image height="70px" width="70px" src={clueNoteIcon} alt="clue Note icon" />;
            case "envelope":
                return <Image height="70px" width="70px" src={envelope} alt="envelope" />;
            default:
                return <Image height="70px" width="70px" src={tornPaper} alt="torn paper" />;
        }
    }
    return null;
}

export const NotesOpen: React.FC<NotesOpenProps> = (props) => {
    let cluesArray = props.cluesArray;
    let setCluesArrayRemoveFunction = props.setCluesArrayRemoveFunction;
    return (
        <View className="notes notes-change show-gradual">
            <View className={props.isChecked ? "dark" : "light"} height="auto">
                <View className="notes notes-change show-gradual">
                    <View height="auto">
                        <strong>Clues/Notes</strong>
                        {cluesArray.map((clue, index) => (
                            <React.Fragment key={clue.gameClueID + "-" + index}>
                                <Flex className="clue-row small">
                                    <View className="italics">{clue.gameClueName}:</View>
                                    <View dangerouslySetInnerHTML={{ __html: DangerouslySetInnerHTMLSanitized(clue.gameClueText) }} padding="0 10px">
                                    </View>
                                    <Button className="link-button small delete-notes" onClick={() => setCluesArrayRemoveFunction(index)}>x</Button>
                                </Flex>
                                <Image src={clue.gameClueImage} alt={clue.gameClueName} />
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                <View className={(props.clues !== '' && props.clues !== undefined) ? "small show" : "hide"}>
                    <View textAlign="center">
                        <Button 
                            className={props.isChecked ? "link-button small dark" : "link-button small light"}
                            onClick={() => props.setCluesArray([])}
                        >
                            clear all clues
                        </Button>
                    </View>
                </View>
                <View className="textArea-Container">
                    <TextAreaField
                        label="Notes"
                        labelHidden
                        value={props.gameNotes}
                        rows={5}
                        onChange={(e) => props.setGameNotesFunction(e.currentTarget.value, props.setGameNotes)}
                        descriptiveText="Take some Notes - close when done, they will still be here"
                    />
                </View>
            </View>
        </View>
    )
}
