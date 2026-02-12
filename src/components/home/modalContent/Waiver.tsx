// components/Waiver.tsx
import {useContext, useEffect, useState} from "react";
import {Button, View, Alert, Flex} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type {GameDetails} from "../../../types/game";

interface WaiverProps {
    gameDetails: GameDetails;
    setGameDetails: (gameDetails: GameDetails | null) => void;
    gameIntro?: boolean;
}

export default function Waiver({gameDetails, setGameDetails, gameIntro}: WaiverProps) {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("Waiver must be used within MyAuthContext.Provider");
    const { setModalContent } = context;
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');

    useEffect(() => {
        if (!gameIntro) {
            console.log("***useEffect***: alert user about signing waiver");
            setIsAlertVisible(true);
            setAlertText('Please agree to Waiver before playing the game.');
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 3000);
        }
    }, []);

    async function agreeToWaiverFunction() {
        /* just set in gameDetails */
        if (setGameDetails) {
            console.log("setting gameDetails.waiverSigned to: ", gameDetails.gameID);
            setGameDetails({...gameDetails, waiverSigned: gameDetails.gameID, numberOfTimes: 0});
        }
        setModalContent({
            gameDesigner: "",
            puzzleID: "",
            open: true,
            content: "Game Intro",
            id: "",
            modalStyle: "game-details",
            action: "",
            gameID: "",
            zoneID: "",
            updatedDB: false
        });
    }

    return (
        <div className={"main-content background-light waiver-container"}>
            <h2>Waiver</h2>
            <Alert variation="info" hasIcon={false} textAlign={"center"}>
                <strong>I will respect all laws, rules, and property rights of the area.
                    I will try not to annoy those around me.</strong>
            </Alert>
            <View>
                <View margin="10px 0">
                    <span>Game play is entirely up to me and at my discretion and I assume all of the risks of participating in this activity.</span>
                </View>
                <View margin="10px 0">
                    <strong>I WAIVE, RELEASE, AND DISCHARGE </strong> from any and all liability for ThinkOutsideGames.org and
                    any affiliated entity that uses these games in any capacity.
                </View>
                <View margin="10px auto" >
                    I certify that I have read this document and I fully understand its content.
                        I am aware that this is a release of liability and a contract and I sign it of my own free will.
                </View>
                <View className={isAlertVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>{alertText}</div>
                </View>
            </View>
            {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                <Button textAlign="center" className="button" onClick={() => agreeToWaiverFunction()}>I agree to Waiver
                    <br />(clicking indicates signing)</Button>
            </Flex>}
        </div>
    );
}