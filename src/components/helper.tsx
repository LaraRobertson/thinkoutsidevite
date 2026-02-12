import { dataService } from "../services/dataService";
import type { NavigateFunction } from "react-router-dom";

export function keyID(src: string, name: string): string {
    return (name + "_" + src);
}

export function setGameNotesFunction(gameNotes: string, setGameNotes: (notes: string) => void): void {
    console.log("gameNotes: " + gameNotes);
    setGameNotes(gameNotes);
    localStorage.setItem("gameNotes", gameNotes);
}

export function setCommentsFunction(notes: string, setGameComments: (comments: string) => void): void {
    console.log('comments: ' + notes);
    setGameComments(notes);
}

export async function goHomeQuit(navigate: NavigateFunction): Promise<void> {
    removeLocalStorage();
    localStorage.removeItem("gameScoreID");
    
    if (localStorage.getItem("numberOfTimes") == "0") {
        const gameStatsID = localStorage.getItem("gameStatsID");
        const gameScoreID = localStorage.getItem("gameScoreID");
        
        try {
            const client = dataService.getClient();
            if (gameStatsID) {
                await client.models.GameStats.delete({ id: gameStatsID });
            }
            if (gameScoreID) {
                await client.models.GameScore.delete({ id: gameScoreID });
            }
        } catch (err) {
            console.log('error deleting game data:', err);
        }
    }
    navigate('/');
}

export function leaveComment(setShowComments: (show: boolean) => void): void {
    console.log('showComments');
    setShowComments(true);
}

export async function goHome(navigate: NavigateFunction, gameComments: string): Promise<void> {
    console.log("game comments: " + gameComments);
    const gameScoreID = localStorage.getItem("gameScoreID");
    
    if (gameScoreID) {
        try {
            const client = dataService.getClient();
            await client.models.GameScore.update({
                id: gameScoreID,
                gameComments: gameComments,
                completed: true
            });
            removeLocalStorage();
            navigate('/');
        } catch (err) {
            console.log('error updating GameScore:', err);
        }
    }
}

export function removeLocalStorage(): void {
    localStorage.removeItem("agreeToWaiver");
    localStorage.removeItem("userAttributes");
    localStorage.removeItem("gameStatsID");
    localStorage.removeItem("gameID");
    localStorage.removeItem("gameName");
    localStorage.removeItem("teamName");
    localStorage.removeItem("gameTime");
    localStorage.removeItem("gameHintVisible");
    localStorage.removeItem("realTimeStart");
    localStorage.removeItem("realTimeEnd");
    localStorage.removeItem("gameNotes");
    localStorage.removeItem("gameTimeHint");
    localStorage.removeItem("clues");
    localStorage.removeItem("cluesArray");
    localStorage.removeItem("gamePuzzleSolved");
    localStorage.removeItem("gamePuzzleGuess");
    localStorage.removeItem("gamePuzzleAnswer");
    localStorage.removeItem("gamePuzzleAnswerCorrect");
}