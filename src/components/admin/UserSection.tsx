import {Button, Flex, Heading, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type User = Schema["User"]["type"];

export default function UserSection() {
    const { setModalContent  } = useContext(MyAuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [statsTitle, setStatsTitle] = useState('');
    const [isUserStatVisible, setIsUserStatVisible] = useState(false);
    const [statsGameName, setStatsGameName] = useState('');
    const [userEmail, setUserEmail] = useState();
    const [userStats, setUserStats] = useState([]);
    
    useEffect(() => {
        console.log("***useEffect***:  fetchUsers()");
        setModalContent({
            open: false,
            content: "",
            userEmail: ""
        })
        fetchUsers();
    }, []);

    function handleUserStats(props) {
        setModalContent({
            open: true,
            content: "User Stats",
            id: props.gameID,
            gameID:"",
            zoneID:"",
            action: props.gameName,
            userEmail: props.email,
            updatedDB:false
        })
    }

    async function deleteGameStatFunction(gameStatIDvar,userEmail) {
        console.log("gameStatIDvar: " + gameStatIDvar);
        try {
            const client = dataService.getClient();
            await client.models.GameStats.delete({ id: gameStatIDvar });
            userStatsFunction(userEmail);
        } catch (err) {
            console.log('error deleting game stat:', err);
        }
    }
    
    async function deleteGameScoreFunction(gameScoreIDvar,userEmail) {
        console.log("gameScoreIDvar: " + gameScoreIDvar);
        try {
            const client = dataService.getClient();
            
            // Delete related GameStopTime records
            const { data: gameStopTimes } = await client.models.GameStopTime.list({
                filter: { gameScoreID: { eq: gameScoreIDvar } }
            });
            
            for (const stopTime of gameStopTimes) {
                await client.models.GameStopTime.delete({ id: stopTime.id });
            }
            
            // Delete related GameHintTime records
            const { data: gameHintTimes } = await client.models.GameHintTime.list({
                filter: { gameScoreID: { eq: gameScoreIDvar } }
            });
            
            for (const hintTime of gameHintTimes) {
                await client.models.GameHintTime.delete({ id: hintTime.id });
            }
            
            // Delete the GameScore
            await client.models.GameScore.delete({ id: gameScoreIDvar });
            userStatsFunction(userEmail);
        } catch (err) {
            console.log('error deleting game score:', err);
        }
    }
    
    async function createUserGamePlay(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const data = {
            gameId: form.get("GameID"),
            userId: form.get("UserID"),
        };
        try {
            const client = dataService.getClient();
            await client.models.UserGamePlay.create(data);
        } catch (err) {
            console.log('error creating user game play:', err);
        }
        event.target.reset();
    }
    
    async function createUser(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const data = {
            userName: form.get("UserName"),
            email: form.get("Email"),
        };
        try {
            const client = dataService.getClient();
            await client.models.User.create(data);
            fetchUsers();
        } catch (err) {
            console.log('error creating user:', err);
        }
        event.target.reset();
    }
    
    async function deleteUser(props) {
        console.log("props.userID: " + props.userID);
        try {
            const client = dataService.getClient();
            await client.models.User.delete({ id: props.userID });
            fetchUsers();
        } catch (err) {
            console.log('error deleting user:', err);
        }
    }
    
    async function fetchUsers() {
        try {
            const client = dataService.getClient();
            const { data: usersFromAPI } = await client.models.User.list();
            setUsers(usersFromAPI);
        } catch (err) {
            console.log('error fetching users:', err);
        }
    }

    // Placeholder function - needs to be implemented based on your requirements
    function userStatsFunction(email) {
        console.log("userStatsFunction called for:", email);
        // Implementation depends on your specific user stats logic
    }

    return (
        <>
            <View id="userSection" className="show section">
                <Heading level={3} color="black">Users</Heading>
            </View>

        <View as="form" margin="3rem 0" onSubmit={createUserGamePlay}>
            <Flex direction="row" justifyContent="center">
                <TextField
                    name="GameID"
                    placeholder="Game ID"
                    label="Game ID"
                    labelHidden
                    variation="quiet"
                    required
                />
                <TextField
                    name="UserID"
                    placeholder="User ID"
                    label="User ID"
                    labelHidden
                    variation="quiet"
                    required
                />
                <Button type="submit" variation="primary">
                    createUserGamePlay
                </Button>
                <Button variation="primary">
                    createUserGamePlay
                </Button>
            </Flex>
            {users.map((user) => (
                <View key={user.id}>
                    <div><strong>user
                        id</strong>: {user.id} | <strong>email</strong>: {user.email} | <strong>userName</strong>: {user.userName}
                    </div>
                    <div><Button marginRight="5px" className="button"
                                 onClick={() => handleUserStats({"email": user.email})}>User Stat</Button>
                        <Button className="button"
                                onClick={() => deleteUser({"userID": user.id})}>Delete User</Button>

                        <hr/>
                    </div>
                </View>
            ))}
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
        </View></>)
}