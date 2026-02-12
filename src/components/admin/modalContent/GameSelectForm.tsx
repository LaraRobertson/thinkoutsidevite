import { useContext, useEffect, useState } from 'react';
import { Button, Heading, View } from '@aws-amplify/ui-react';
import { MyAuthContext } from "../../../MyContext.tsx";
import { dataService } from "../../../services/dataService.ts";
import { getDefaultModalContent } from "../../../utils/modalHelpers.ts";
import type { Schema } from "../../../../amplify/data/resource.ts";

type Game = Schema["Game"]["type"];

export default function GameSelectForm() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameSelectForm must be used within MyAuthContext.Provider");
    const { modalContent, setModalContent } = context;
    const [games, setGames] = useState<Game[]>([]);
    const [userGamePlayIDs, setUserGamePlayIDs] = useState<string[]>([]);
    const userID = modalContent.id;
    const userEmail = modalContent.userEmail;

    useEffect(() => {
        async function loadGames() {
            try {
                const client = dataService.getClient();
                const { data } = await client.models.Game.list();
                setGames(data);
                
                // Load user's existing game access
                const { data: userGamePlays } = await client.models.UserGamePlay.list({
                    filter: { userId: { eq: userID } },
                    selectionSet: ['gameId']
                });
                
                if (userGamePlays) {
                    const gameIDs = userGamePlays.map(ugp => ugp.gameId).filter(Boolean) as string[];
                    setUserGamePlayIDs(gameIDs);
                }
            } catch (err) {
                console.error('error loading games:', err);
            }
        }
        loadGames();
    }, [userID]);

    async function addUserToGame(gameID: string) {
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.UserGamePlay.create({
                gameId: gameID,
                userId: userID || ''
            });

            if (result.errors) {
                console.error('Errors adding user to game:', result.errors);
                window.alert("Error adding user to game: " + JSON.stringify(result.errors));
                return;
            }

            window.alert("User added to game successfully!");
            setModalContent(getDefaultModalContent());
        } catch (err) {
            console.error('error adding user to game:', err);
            window.alert("Error adding user to game: " + err);
        }
    }

    return (
        <>
            <Heading level={5}>Select Game to Add User: {userEmail}</Heading>
            <View>
                {games.map((game) => (
                    <View key={game.id} padding="0.5rem">
                        <div>
                            <strong>{game.gameName}</strong> | {game.gameLocationCity}
                            {userGamePlayIDs.includes(game.id) && <span style={{color: 'green', marginLeft: '10px'}}>(Already added)</span>}
                        </div>
                        <Button 
                            size="small" 
                            variation="primary" 
                            onClick={() => addUserToGame(game.id)}
                            isDisabled={userGamePlayIDs.includes(game.id)}
                        >
                            Add User to This Game
                        </Button>
                    </View>
                ))}
            </View>
        </>
    );
}
