import {View} from "@aws-amplify/ui-react";
import Diary from "../../assets/icons/diary.svg?react";
import MessageInABottle from "../../assets/icons/message-in-a-bottle.svg?react";
import ClueIcon from "../../assets/icons/magnifying-glass.svg?react";
import ClueNoteIcon from "../../assets/icons/note-question.svg?react";
import Envelope from "../../assets/icons/envelope.svg?react";
import TornPaper from "../../assets/icons/torn-paper.svg?react";
import {keyID} from "../helper";
import type { Schema } from "../../../amplify/data/resource";
import {useContext} from "react";
import {MyAuthContext} from "../../MyContext.tsx";

type GameClue = Schema["GameClue"]["type"];

interface GameClueProps {
    zoneVisible: string;
    clue: GameClue;
    setGameClueVisible: (hints: Record<string, boolean>) => void;
    gameClueVisible: Record<string, boolean>;
    index: number;
}

interface IconClueDisplayProps {
    gameClueIcon?: string;
    index: number;
    hide?: string;
    isChecked: boolean;
}

const IconClueDisplay = (props: IconClueDisplayProps) => {
    console.log("props.gameClueIcon: " + props.gameClueIcon);
    if (props.gameClueIcon != "") {
        switch (true) {
            case (props.gameClueIcon == "diary"):
                return (
                    <Diary className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.gameClueIcon == "tornPaper"):
                return (
                    <TornPaper className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.gameClueIcon == "messageInABottle"):
                return (
                    <MessageInABottle className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.gameClueIcon == "clueIcon"):
                return (
                    <ClueIcon className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.gameClueIcon == "clueNoteIcon"):
                return (
                    <ClueNoteIcon className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.gameClueIcon == "envelope"):
                return (
                    <Envelope className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            default:
                return (
                    <TornPaper className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
        }
    } else {
        switch (true) {
            case (props.index == 0):
                return (
                    <Diary className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.index == 1):
                return (
                    <TornPaper className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            case (props.index % 5 == 0):
                return (
                    <MessageInABottle className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />

                );
            case (props.index % 4 == 0):
                return (
                    <ClueIcon className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />

                );
            case (props.index % 3 == 0):
                return (
                    <ClueNoteIcon className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />

                );
            case (props.index % 2 == 0):
                return (
                    <Envelope className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
            default:
                return (
                    <TornPaper className={props.isChecked ? "dark-background " : "light-background "} height={40} width={40} />
                );
        }
    }
}

export default function GameClue(props: GameClueProps) {
    const { clue,zoneVisible, setGameClueVisible, gameClueVisible, index} = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("Game must be used within MyAuthContext.Provider");
    const { isChecked } = context;

    function setGameClueVisibleFunction(key: string, value: boolean) {
        console.log("setGameClueVisibleFunction: " + key);
        /* check if true or false */
        if (gameClueVisible[key]) {
            setGameClueVisible({...gameClueVisible, [key]: false});
            /* no need to set in local storage
            const newObject = {...gameClueVisible,[key]:false};
            const gameClueVisibleTest = JSON.stringify(newObject);
            if (gameClueVisibleTest != "{}" &&  gameClueVisibleTest != "" &&  gameClueVisibleTest != null) {
                localStorage.setItem("gameClueVisible", gameClueVisibleTest);
            } */
            return;
        }
        const newObject = {...gameClueVisible,[key]:value};
        const gameClueVisibleTest = JSON.stringify(newObject);
        if (gameClueVisibleTest != "{}" &&  gameClueVisibleTest != "" &&  gameClueVisibleTest != null) {
            localStorage.setItem("gameClueVisible", gameClueVisibleTest);
        }
        if (key) {
            setGameClueVisible({...newObject, [key]: value})
        }
    }
    
    if (zoneVisible==clue.gamePlayZoneID) {
        return (
            <View aria-label={clue.gameClueName || ''} key={keyID(clue.id,"clue")}
                  className={"game-item clue"+ index}
                  onClick={() => setGameClueVisibleFunction("clue" + (clue.id), true)}
            >
                {gameClueVisible["clue" + (clue.id)]? (
                    <div>
                        <h4>clue:</h4>
                        {clue.gameClueText}
                        <button className={isChecked? "button background-light" : "button background-dark"}>close</button>
                    </div>
                    ):(
                    <IconClueDisplay index={index} hide="true" gameClueIcon={clue.gameClueIcon || ''} isChecked={isChecked || false}/>

                )}
            </View>

        )
    }
    return null;
}