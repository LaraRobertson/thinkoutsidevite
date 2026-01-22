import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGame6Props {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame6(props: ExampleGame6Props) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame6 must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View paddingBottom="10px">
                    <View className="example"><strong>Zone Map </strong>shows where the zones are located (you can also identify Zones by central image).</View>
                    <Image src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-help.jpg" alt="help and hints"/>
                    <View className="example"><strong>Help </strong> - Tap on Help button for some simple game advice and Hints.</View>
                    <View className="example"><strong>Hints </strong> - Tap On A Hint (in Help Popup) if you are stuck but it adds 5 minutes to your time</View>
                    <Image width="200px" src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-modal.png" alt="hints" />
                </View>
            </View>
        </>
    );
}