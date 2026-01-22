import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGame2Props {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame2(props: ExampleGame2Props) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame2 must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View>
                    <View className="example"><strong>Clue Icons on Left, Puzzle Icons on Right.</strong></View>
                    <Image width="200px" src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPuzzles.jpg" alt="clues and puzzles"/>
                    <View>Tap Icon on the Left.</View>
                    <Image width="180px" src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPopup.jpg" alt="clue popup"/>
                    <View className="example">The Clue Popup will ask a question, or show an image, or provide some words.
                        You have to figure out what it means.</View>
                </View>
            </View>
        </>
    );
}