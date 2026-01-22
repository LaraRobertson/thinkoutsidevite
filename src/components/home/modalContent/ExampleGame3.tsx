import React, {useContext} from "react";
import {View, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../../MyContext";
import type { GameDetailsVar } from "../../../types/game";

interface ExampleGame3Props {
    gameDetails?: GameDetailsVar;
    gameIntro?: string;
}

export default function ExampleGame3(props: ExampleGame3Props) {
    const { gameDetails, gameIntro } = props;
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("ExampleGame3 must be used within MyAuthContext.Provider");
    const { setModalContent, setGameDetails } = context;

    const nextFunction = async () => {
        console.log("next function");
    };

    return (
        <>
            <View>
                <View>
                    <Image width="180px" src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleLayout-PuzzlePopup.jpg" alt="puzzle popup"/>
                    <View className="example">Puzzle are forms - type in the answer into the appropriate field(s) to solve the puzzle.</View>
                    <View className="example">You have to figure out answers based on clues.</View>
                    <View className="example">If you answer one field correctly there will be a green check.</View>
                    <View className="example">
                        <Image width="300px" src="https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/puzzlesolved.png" alt="puzzle solved" />
                        <br />If you answer all the fields correctly
                        there will be a puzzle is solved message (and the puzzle will close).
                    </View>
                    <View className="example">You can close puzzle popup without completing it, your correct answers will still be there.</View>
                    <View className="example">After puzzle closes there may be a Clue available, so be alert.</View>
                </View>
            </View>
        </>
    );
}