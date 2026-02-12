import {Button, View} from "@aws-amplify/ui-react";
import {keyID} from "../helper";
import type { Schema } from "../../../amplify/data/resource";
import {useEffect, useState} from "react";

type GameHint = Schema["GameHint"]["type"];

interface GameHintProps {
    zoneVisible: string;
    hint: GameHint;
    setGameTimeHint: (time: number) => void;
    setGameHintVisible: (hints: Record<string, boolean>) => void;
    gameHintVisible: Record<string, boolean>;
    index: number;
}

export default function GameHint(props: GameHintProps) {
    const {hint, zoneVisible, setGameHintVisible, setGameTimeHint, gameHintVisible, index} = props;
    const [addHint, setAddHint] = useState(false);
    const [isAlertHintWarningVisible, setIsAlertHintWarningVisible] = useState(false);
    useEffect(() => {
        console.log("***useEffect***: addHint");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        if (addHint) {
            addHintFunction();
        }
    }, [addHint]);
    function addHintFunction() {
        if (!addHint) return;
        
        const key = "hint" + hint.id;
        const newObject = {...gameHintVisible, [key]: true};
        
        // Add hint to array and set to true
        setGameHintVisible(newObject);
        
        // Calculate total hint time
        let hintTime = 0;
        for (const hintKey in newObject) {
            if (newObject[hintKey] === true) {
                hintTime = hintTime + 5;
            }
        }
        
        setGameTimeHint(hintTime);
        localStorage.setItem("gameTimeHint", hintTime.toString());
        
        const gameHintVisibleTest = JSON.stringify(newObject);
        if (gameHintVisibleTest !== "{}" && gameHintVisibleTest !== "" && gameHintVisibleTest !== null) {
            localStorage.setItem("gameHintVisible", gameHintVisibleTest);
        }
    }

    function setGameHintVisibleFunction(key: string) {
        console.log("setGameHintVisibleFunction: " + JSON.stringify(gameHintVisible));
        
        // Check if hint is in the array
        if (Object.prototype.hasOwnProperty.call(gameHintVisible, key)) {
            // Toggle the existing value (opposite of what it was)
            const newValue = !gameHintVisible[key];
            const newObject = {...gameHintVisible, [key]: newValue};
            
            setGameHintVisible(newObject);
            const gameHintVisibleTest = JSON.stringify(newObject);
            if (gameHintVisibleTest !== "{}" && gameHintVisibleTest !== "" && gameHintVisibleTest !== null) {
                localStorage.setItem("gameHintVisible", gameHintVisibleTest);
            }
        } else {
            // Hint not in array - show alert to ask question
            setIsAlertHintWarningVisible(true);
        }
    }
    
    if (zoneVisible==hint.gamePlayZoneID) {
        return (
            <>
            <View aria-label={hint.gameHintName || ''} key={keyID(hint.id,"hint")}
                  className={"game-item hint"+ index}
                  onClick={() => setGameHintVisibleFunction("hint" + (hint.id))}
            >
                {gameHintVisible && gameHintVisible["hint" + (hint.id)]? (
                    <div>
                        <h4>hint:</h4>
                        {hint.gameHintDescription}
                        <button className={"button background-light"}>close</button>
                    </div>
                    ):(
                    <div>{hint.gameHintName}</div>
                )}
            </View>
        <View className={isAlertHintWarningVisible ? "alert-container show" : "hide"}>
            <div className='alert-inner'>Do You Really Want A Hint? (it costs 5 minutes)<br/>
                <Button marginRight={"10px"} className="button button-small quit-button-alert "
                        onClick={() => {
                            setAddHint(true);
                            setIsAlertHintWarningVisible(false);
                        }}>Yes, I Want This Hint</Button>
                <Button marginRight={"10px"} className="button button-small quit-button-alert"
                        onClick={() => {
                            setAddHint(false);
                            setIsAlertHintWarningVisible(false);
                        }}>No</Button>
            </div>
        </View></>

        )
    }
    return null;
}