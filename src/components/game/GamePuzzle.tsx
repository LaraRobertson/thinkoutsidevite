import {TextField, View} from "@aws-amplify/ui-react";
import PuzzleIconClosed from "../../assets/icons/noun-locker-6097531.svg?react";
import PuzzleIconOpen from "../../assets/icons/noun-locker-6097523.svg?react";
import SafeBoxClosed from "../../assets/icons/noun-safebox-7186604.svg?react";
import SafeBoxOpen from "../../assets/icons/noun-safebox-open-319684.svg?react";
import BoxClosed from "../../assets/icons/noun-box-locked-4427371.svg?react";
import BoxOpen from "../../assets/icons/noun-open-package-6999076.svg?react";
import SafeDepositBoxOpen from "../../assets/icons/noun-safe-deposit-box-open-5414386.svg?react";
import SafeDepositBoxClosed from "../../assets/icons/noun-safe-deposit-box-closed-6008306.svg?react";
import PadlockClosed from "../../assets/icons/noun-padlock-closed-2186012.svg?react";
import PadlockOpen from "../../assets/icons/noun-padlock-open-2185952.svg?react";
import type { Schema } from "../../../amplify/data/resource";
import {useContext} from "react";
import {MyAuthContext} from "../../MyContext.tsx";

type GamePuzzle = Schema["GamePuzzle"]["type"];
type TextField = Schema["TextField"]["type"];

interface GamePuzzleWithTextFields extends Omit<GamePuzzle, 'textField'> {
    textField: TextField[];
}

interface GamePuzzleProps {
    gamePuzzleDetails: {
        puzzleID: string;
        textFields: TextField[];
        puzzleName?: string;
        puzzleClueText?: string;
    };
    setModalPuzzleContent: (content: { show: boolean; content: string }) => void;
    zoneVisible: string;
    puzzle: GamePuzzleWithTextFields;
    index: number;
    setGamePuzzleDetails: (gamePuzzleDetails: {
        puzzleID: string;
        textFields: TextField[];
        puzzleName?: string;
        puzzleClueText?: string;
    }) => void;
    gamePuzzleSolved: Record<string, boolean>;
    gamePuzzleGuess: Record<string, string>;
    gamePuzzleAnswer: Record<string, string>;
    gamePuzzleAnswerCorrect: Record<string, boolean>;
}

interface IconPuzzleDisplayProps {
    index: number;
}

interface PuzzleDetailParams {
    textField?: TextField[];
    puzzleID: string;
    puzzleName?: string;
    puzzleClueText?: string;
}

export default function GamePuzzle(props: GamePuzzleProps) {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("Game must be used within MyAuthContext.Provider");
    const { isChecked } = context;

    const { zoneVisible, setModalPuzzleContent, puzzle, gamePuzzleSolved, index, setGamePuzzleDetails,} = props;

    const IconPuzzleDisplay = (props: IconPuzzleDisplayProps) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <PuzzleIconClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
            );
            case (props.index == 1):
                return (
                    <SafeBoxClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 5 == 0):
                return (
                    <PadlockClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 3 == 0):
                return (
                    <BoxClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 2 == 0):
                return (
                    <SafeDepositBoxClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            default:
                return (
                    <PuzzleIconClosed className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />

                );
        }
    }
    
    const IconPuzzleDisplayOpen = (props: IconPuzzleDisplayProps) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <PuzzleIconOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index == 1):
                return (
                    <SafeBoxOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 5 == 0):
                return (
                    <PadlockOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 3 == 0):
                return (
                    <BoxOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            case (props.index % 2 == 0):
                return (
                    <SafeDepositBoxOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />
                );
            default:
                return (
                    <PuzzleIconOpen className={isChecked ? "dark-background " : "light-background "} height={50} width={50} />

                );
        }
    }

    function handlePuzzleDetail(gamePuzzleDetails: PuzzleDetailParams) {
        console.log("handlePuzzleDetail: " + JSON.stringify(gamePuzzleDetails));
        const statePuzzleDetails = {
            puzzleID: gamePuzzleDetails.puzzleID,
            textFields: gamePuzzleDetails.textField as TextField[],
            puzzleName: gamePuzzleDetails.puzzleName,
            puzzleClueText: gamePuzzleDetails.puzzleClueText,
        };
        setGamePuzzleDetails(statePuzzleDetails);
        setModalPuzzleContent({
            show: true,
            content: "puzzle"
        })
    }

    if (zoneVisible==puzzle.gamePlayZoneID) {
        return (
           <View key={puzzle.id}>
                <View className={(zoneVisible == puzzle.gamePlayZoneID) ? "show puzzle" : "hide"}>
                    <View>

                        {/* if clue or wingame - am changing so you can open it whenever, if it solved you get clue*/}
                        {gamePuzzleSolved[puzzle.id] ? (
                            <>
                            <View onClick={()=> handlePuzzleDetail({
                                textField: puzzle.textField,
                                puzzleID: puzzle.id,
                                puzzleName: puzzle.puzzleName || undefined,
                                puzzleClueText: puzzle.puzzleClueText || undefined
                            })}
                                  className={gamePuzzleSolved[puzzle.id] ? "show game-item puzzle-solved" : "hide"}
                            >
                                <IconPuzzleDisplayOpen index={index}/>
                                <div className={"small"}>{(puzzle.puzzleClueText !== '') ? "has clue" : "solved"}</div>
                            </View>
                            </>
                        ) : (

                            <View onClick={() => handlePuzzleDetail({
                                textField: puzzle.textField,
                                puzzleID: puzzle.id,
                                puzzleName: puzzle.puzzleName || undefined,
                                puzzleClueText: puzzle.puzzleClueText || undefined
                            })}
                                  className={gamePuzzleSolved[puzzle.id] ? "hide" : "show game-item puzzle-not-solved"}>
                                <IconPuzzleDisplay index={index}/>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        )
    }
    return null;
}