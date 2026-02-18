import { Icon, TextField, View } from "@aws-amplify/ui-react";
import { useContext, useState } from "react";
import { MyAuthContext } from "../../MyContext";
import { shallowEqual } from "../shallowEqual";
import type { Schema } from "../../../amplify/data/resource";

type GamePuzzle = Schema["GamePuzzle"]["type"];
type TextField = Schema["TextField"]["type"];

interface ModalPuzzleContentProps {
    gamePuzzleDetails: {
        puzzleID: string;
        textFields: TextField[];
        puzzleName?: string;
        puzzleClueText?: string;
    };
    gamePuzzleGuess: Record<string, string>;
    setGamePuzzleGuess: (guess: Record<string, string>) => void;
    setGamePuzzleAnswer: (answer: Record<string, string>) => void;
    gamePuzzleSolved: Record<string, boolean>;
    setGamePuzzleSolved: (solved: Record<string, boolean>) => void;
    gamePuzzleAnswer: Record<string, string>;
    gamePuzzleAnswerCorrect: Record<string, boolean>;
    gamePuzzleArray: GamePuzzle[];
    setModalPuzzleContent: (content: { show: boolean; content: string }) => void;
    setGamePuzzleAnswerCorrect: (answerCorrect: Record<string, boolean>) => void;
    setGameComplete: (complete: boolean) => void;
}

const CHECKMARK_PATH = "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z";

export default function ModalPuzzleContent(props: ModalPuzzleContentProps) {
    const context = useContext(MyAuthContext);
    
    const {
        gamePuzzleDetails,
        gamePuzzleGuess,
        setGamePuzzleGuess,
        setGamePuzzleAnswer,
        gamePuzzleSolved,
        setGamePuzzleSolved,
        gamePuzzleAnswer,
        gamePuzzleArray,
        setModalPuzzleContent,
        gamePuzzleAnswerCorrect,
        setGamePuzzleAnswerCorrect,
        setGameComplete
    } = props;
        
    const [localGamePuzzleSolved, setLocalGamePuzzleSolved] = useState(gamePuzzleSolved);
    
    if (!context) return null;
    const { isChecked } = context;

    const saveToLocalStorage = (key: string, data: Record<string, string | boolean>) => {
        const jsonData = JSON.stringify(data);
        if (jsonData !== "{}" && jsonData !== "" && jsonData !== null) {
            localStorage.setItem(key, jsonData);
        }
    };

    const validateAnswer = (guess: string, answer: string): boolean => {
        if (answer.includes("{")) {
            const answerObject = JSON.parse(answer);
            return Object.values(answerObject).some(value => 
                shallowEqual(guess, String(value))
            );
        }
        return shallowEqual(guess, answer);
    };

    const checkAllFieldsCorrect = (puzzle: GamePuzzle, textFieldID: string): boolean => {
        const textFields = puzzle.textField || [];
        const textFieldsArray = Array.isArray(textFields) ? textFields : [];
        
        if (textFieldsArray.length <= 1) return true;

        return textFieldsArray.every(field => {
            if (!field?.id || field.id === textFieldID) return true;
            return Object.prototype.hasOwnProperty.call(gamePuzzleAnswerCorrect, field.id) && 
                   gamePuzzleAnswerCorrect[field.id];
        });
    };

    const handlePuzzleSolved = (puzzleID: string) => {
        const newSolvedState = { ...gamePuzzleSolved, [puzzleID]: true };
        
        setGamePuzzleSolved(newSolvedState);
        setLocalGamePuzzleSolved(newSolvedState);
        saveToLocalStorage("gamePuzzleSolved", newSolvedState);
        /*console.log("gamePuzzleSolved: " + JSON.stringify(gamePuzzleSolved));*/

        setTimeout(() => {
            setModalPuzzleContent({ show: true, content: "puzzle" });
        }, 2000);

        const solvedCount = Object.values(newSolvedState).filter(Boolean).length;
        if (solvedCount === gamePuzzleArray.length) {
            setTimeout(() => {
                setGameComplete(true);
                setModalPuzzleContent({ show: false, content: "puzzle" });
            }, 3000);
        }
    };

    const setGamePuzzleGuessFunction = (
        textFieldID: string, 
        guess: string, 
        answer: string, 
        puzzleID: string
    ) => {
        if (!textFieldID) return;

        const newGuess = { ...gamePuzzleGuess, [textFieldID]: guess };
        const newAnswer = { ...gamePuzzleAnswer, [textFieldID]: answer };

        setGamePuzzleGuess(newGuess);
        setGamePuzzleAnswer(newAnswer);
        saveToLocalStorage("gamePuzzleGuess", newGuess);
        saveToLocalStorage("gamePuzzleAnswer", newAnswer);

        const isCorrect = validateAnswer(guess, answer);
        const newCorrectState = { ...gamePuzzleAnswerCorrect, [textFieldID]: isCorrect };
        
        setGamePuzzleAnswerCorrect(newCorrectState);
        if (isCorrect) {
            saveToLocalStorage("gamePuzzleAnswerCorrect", newCorrectState);
        }

        if (isCorrect) {
            const currentPuzzle = gamePuzzleArray.find(puzzle => puzzle.id === puzzleID);
            if (currentPuzzle && checkAllFieldsCorrect(currentPuzzle, textFieldID)) {
                handlePuzzleSolved(puzzleID);
            }
        }
    };

    const renderCheckmarkIcon = () => (
        <Icon
            height="20px"
            width="20px"
            ariaLabel="CheckMark"
            viewBox={{ minX: 0, minY: 0, width: 500, height: 500 }}
            paths={[{ d: CHECKMARK_PATH, fill: "#6c4" }]}
        />
    );

    const renderSolvedPuzzle = () => (
        <> <div>
            <div className="textFieldContainer">
                <div className={"blue-alert"}><strong>Puzzle is Solved!</strong></div>
                <View className="right-answer">
                    {renderCheckmarkIcon()}
                </View>
            </div>
            {gamePuzzleDetails.puzzleClueText && (
                <div><hr /><h4>Bonus Clue: </h4>{gamePuzzleDetails.puzzleClueText}</div>
            )}
            <hr />
            <h4>Solved Puzzle:</h4>
                {gamePuzzleDetails.textFields.map((field) => (
                    <div key={field.id}>
                        <strong>Question</strong>: {field.label} <br /><strong>Answer</strong>: {field.answer}
                    </div>
                ))}
            </div>
        </>
    );

    const renderUnsolvedPuzzle = () => (
        <>
            {gamePuzzleDetails.textFields.map((field) => (
                <div className="textFieldContainer" key={field.id}>
                    <TextField
                        className={isChecked ? "puzzleTextField light-label" : "puzzleTextField dark-label"}
                        label={field.label || ""}
                        value={Object.prototype.hasOwnProperty.call(gamePuzzleGuess, field.id) 
                            ? gamePuzzleGuess[field.id] 
                            : ""
                        }
                        placeholder="Input answer for above"
                        onChange={(event) => setGamePuzzleGuessFunction(
                            field.id,
                            event.target.value,
                            field.answer || "",
                            gamePuzzleDetails.puzzleID
                        )}
                    />
                    {gamePuzzleAnswerCorrect[field.id] && 
                     gamePuzzleAnswer[field.id] && 
                     gamePuzzleGuess[field.id] ? (
                        <View className="right-answer">
                            {renderCheckmarkIcon()}
                        </View>
                    ) : (
                        <View className="right-answer" />
                    )}
                </div>
            ))}
        </>
    );

    return (
        <View paddingTop="10px">
            {localGamePuzzleSolved[gamePuzzleDetails.puzzleID] 
                ? renderSolvedPuzzle() 
                : renderUnsolvedPuzzle()
            }
        </View>
    );
}