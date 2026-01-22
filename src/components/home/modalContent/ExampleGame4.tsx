import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGame4Props {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame4(props: ExampleGame4Props) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame4 must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View>
                    <View paddingBottom="10px">
                        <View className="example"><strong>Your Time is Your Score</strong></View>
                        <View className="example">Your total time is calculated from the time you start game and how many hints you use</View>
                        <View className="example">Time information is right below Zone Game Area and above Clues/Notes area.</View>
                        <Image src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-time.jpg" alt="clues and puzzles"/>
                        <View className="example">Note: Each hint you use adds 5 minutes to your score.</View>
                    </View>
                </View>
            </View>
        </>
    );
}