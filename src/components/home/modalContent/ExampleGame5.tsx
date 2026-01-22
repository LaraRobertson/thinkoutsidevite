import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGame5Props {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame5(props: ExampleGame5Props) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame5 must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View paddingBottom="10px">
                    <View className="example"><strong>Clues/Notes Area</strong></View>
                    <View className="example">You can add your clues to this area (see button on clue popup) if you need
                    to see things in a different way.</View>
                    <View className="example">You can take notes too.</View>
                    <Image src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Notes.jpg" alt="clues and puzzles"/>
                </View>
            </View>
        </>
    );
}