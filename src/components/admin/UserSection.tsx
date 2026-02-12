import {Button, Flex, Heading, TextField, View} from "@aws-amplify/ui-react";
import {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import { dataService } from "../../services/dataService";
import {createModalContent, getDefaultModalContent} from "../../utils/modalHelpers.ts";
import type {Schema} from "../../../amplify/data/resource.ts";



export default function UserSection() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { setModalContent} = context;
    const [users] = useState<Array<Schema["User"]["type"]>>([]);
    useEffect(() => {
        console.log("***useEffect***:  initialize");
        /* close modal */
        setModalContent(getDefaultModalContent());
    }, []);

    function handleUserStats(props: { email: string }) {
        setModalContent(createModalContent({
            open: true,
            content: "User Stats",
            userEmail: props.email
        }))
    }
    
    async function createUserGamePlay(props: { userID: string, userEmail: string }) {
        setModalContent(createModalContent({
            open: true,
            content: "Game Select",
            id: props.userID,
            userEmail: props.userEmail
        }));
    }
    
    async function createUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const data = {
            userName: form.get("UserName") as string,
            email: form.get("Email") as string,
        };
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.User.create(data);
            
            if (result.errors) {
                console.error('Errors creating user:', result.errors);
                window.alert("Error creating user: " + JSON.stringify(result.errors));
                return;
            }
            
            window.alert("User created successfully!");
        } catch (err) {
            console.error('error creating user:', err);
            window.alert("Error creating user: " + err);
        }
        event.currentTarget.reset();
    }
    
    async function deleteUser(props:{ userID: string }) {
        console.log("props.userID: " + props.userID);
        try {
            const client = dataService.getAuthClient();
            
            // Delete related GameScore records first
            const { data: gameScores } = await client.models.GameScore.list({
                filter: { userID: { eq: props.userID } }
            });
            
            for (const score of gameScores || []) {
                await client.models.GameScore.delete({ id: score.id });
            }
            
            // Delete related Game records
            const { data: games } = await client.models.Game.list({
                filter: { userID: { eq: props.userID } }
            });
            
            for (const game of games || []) {
                await client.models.Game.delete({ id: game.id });
            }
            
            // Finally delete the user
            await client.models.User.delete({ id: props.userID });
        } catch (err) {
            console.log('error deleting user:', err);
        }
    }

    return (
        <>
            <View id="userSection" className="show section">
                <Heading level={3} color="black">Users</Heading>
            </View>
            

            <View>
                {users.map((user) => (
                    <View key={user.id}>
                        <div><strong>user
                            id</strong>: {user.id} | <strong>email</strong>: {user.email} | <strong>userName</strong>: {user.userName}
                        </div>
                        <div><Button marginRight="5px" className="button"
                                     onClick={() => handleUserStats({"email": user.email})}>User Stat</Button>
                            <Button className="button"
                                    onClick={() => deleteUser({"userID": user.id})}>Delete User</Button>
                            <Button className="button"
                                    onClick={() => createUserGamePlay({"userID": user.id, "userEmail": user.email})}>Add User to Game</Button>

                            <hr/>
                        </div>
                    </View>
                ))}
            </View>

            <View as="form" margin="3rem 0" onSubmit={createUser}>
                <Flex direction="row" justifyContent="center" gap="1rem">
                    <TextField
                        name="UserName"
                        placeholder="User Name"
                        label="User Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="Email"
                        placeholder="Email"
                        label="Type"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <Button marginBottom="10px" type="submit" variation="primary">
                        Create User
                    </Button>
                </Flex>
            </View>
        </>)
}