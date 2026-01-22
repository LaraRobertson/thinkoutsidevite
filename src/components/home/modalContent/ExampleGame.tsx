import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGameProps {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame(props: ExampleGameProps) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View paddingBottom="10px">
                    <View className="example"><strong>Zones - icons at the top of screen</strong></View>
                    <View className="example">Tap Zone # icon to show Clues and Puzzles in Other Zones</View>
                    <View className="example">Clues are within 100 feet of Zone.</View>
                    <View className="example">Find the other Zones during game play.</View>
                    <Image src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Zones.jpg" alt="clues and puzzles"/><br />
                </View>
            </View>
        </>
    );
}