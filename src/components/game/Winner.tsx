import {
    Button,
    Flex,
    Heading,
    TextAreaField, ToggleButton,
    ToggleButtonGroup,
    View
} from "@aws-amplify/ui-react";
import {useState} from "react";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";
import {useNavigate} from "react-router-dom";

type Game = Schema["Game"]["type"];

interface WinnerProps {
    game: Game;
    gameScoreID: string;
    gameTimeHint: number;
    gameTimeTotal: number;
}

export default function Winner(props: WinnerProps) {
    console.log("Winner");
    const { game, gameScoreID, gameTimeHint, gameTimeTotal } = props;

    return (
        <section className={"main-container background-light winner"} >
            <h2>Winner!</h2>
        <View className="black-box">
            <View marginBottom={"10px"}>{game.gameWinMessage}</View>
            <View color="white">Total Time: {gameTimeTotal} minutes</View>
            <View color="white">Hint Time: {gameTimeHint} minutes </View>

        <CommentSection gameScoreID={gameScoreID}/>
        </View>
        </section>
    )
}

export function CommentSection({ gameScoreID }: { gameScoreID: string }) {
    const navigate = useNavigate();
    const [gameComments,setGameComments] = useState<Record<string, string>>({});
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    
    function setGameCommentsFunction(key: string, value: string) {
        setGameComments(prev => {
            const updated = {...prev, [key]: value};
            console.log("Updated gameComments:", updated);
            return updated;
        });
    }
    
    async function updateGameScoreCommentsFunction(gameScoreID:string) {
        console.log("Final gameComments before update:", gameComments);
        console.log("GameScoreID:", gameScoreID);
        try {
            const client = dataService.getAuthClient();
            const result = await client.models.GameScore.update({
                id: gameScoreID,
                gameComments: JSON.stringify(gameComments)
            });
            
            console.log("GameScore update result:", result);
            console.log("update comments");
            localStorage.removeItem("gameScoreID");
            if (Object.keys(gameComments).length > 0) {
                setIsAlertVisible(true);
                setAlertText('Thank you for your comment');
                setTimeout(() => {
                    setIsAlertVisible(false);
                    navigate('/');
                }, 2000);
            } else {
                navigate('/');
            }

        } catch (err) {
            console.log('error updating gameScore:', err);
        }
    }
    
    /* comments */
    const [exclusiveValue1, setExclusiveValue1] = useState('');
    const [exclusiveValue2, setExclusiveValue2] = useState('');
    /*const [exclusiveValue3, setExclusiveValue3] = useState('');
    const [exclusiveValue4, setExclusiveValue4] = useState('');
    const [exclusiveValue5, setExclusiveValue5] = useState('');*/
    
    return (
        <>

            <View className={isAlertVisible ? "alert-container show" : "hide"}>
                <div className='alert-inner'>{alertText}</div>
            </View>
    <Flex   direction="column"
            justifyContent="flex-start"
            alignItems="center"
            alignContent="flex-start"
            wrap="nowrap"
            gap=".4em" marginBottom={"10px"} className={"flex-container"}>

        <Heading level={6} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Did you like the Game?</Heading>
        <ToggleButtonGroup
            value={exclusiveValue1}
            onChange={(value) => {setGameCommentsFunction("like", value as string);setExclusiveValue1(value as string)}}
            isExclusive
            id={"1"}
        >
            <ToggleButton value="yes">
                Yes
            </ToggleButton>
            <ToggleButton value="no">
                No
            </ToggleButton>
            <ToggleButton value="a little">
                A little
            </ToggleButton>
        </ToggleButtonGroup>


        <Heading level={6} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Was it Fun?</Heading>
        <ToggleButtonGroup
            value={exclusiveValue2}
            onChange={(value) => {setGameCommentsFunction("fun", value as string);setExclusiveValue2(value as string)}}
            isExclusive
            id={"1"}
        >
            <ToggleButton value="it was fun">
                It was fun
            </ToggleButton>
            <ToggleButton value="not fun">
                Not fun
            </ToggleButton>
            <ToggleButton value="a little">
                A little
            </ToggleButton>
        </ToggleButtonGroup>

        {/*<Heading level={6} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Would you play another?</Heading>
        <ToggleButtonGroup
            value={exclusiveValue4}
            onChange={(value) => {setGameCommentsFunction("another",value);setExclusiveValue4(value)}}
            isExclusive
            id={"2"}
        >
            <ToggleButton value="yes">
                Yes
            </ToggleButton>
            <ToggleButton value="never">
                Never
            </ToggleButton>
            <ToggleButton value="maybe">
                Maybe
            </ToggleButton>
        </ToggleButtonGroup>*/}

        {/* <Heading level={6} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Would you want to Create a Game Like this?</Heading>
        <ToggleButtonGroup
            value={exclusiveValue3}
            onChange={(value) => {setGameCommentsFunction("create-a-game",value);setExclusiveValue3(value)}}
            isExclusive
            id={"2"}
        >
            <ToggleButton value="yes">
                Yes
            </ToggleButton>
            <ToggleButton value="no">
                No
            </ToggleButton>
            <ToggleButton value="maybe">
                Maybe
            </ToggleButton>
        </ToggleButtonGroup>*/}

        {/* <Heading level={6} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Can I contact you for more feedback?</Heading>

        <ToggleButtonGroup
            value={exclusiveValue5}
            onChange={(value) => {setGameCommentsFunction("contact-you",value);setExclusiveValue5(value)}}
            isExclusive
            id={"2"}
        >
            <ToggleButton value="yes">
                Yes
            </ToggleButton>
            <ToggleButton value="no">
                No
            </ToggleButton>

        </ToggleButtonGroup>*/}

        <TextAreaField
            label="Comments"
            rows={2}
            onChange={(e) => setGameCommentsFunction("textAreaField",e.currentTarget.value)}
            descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
        />
    </Flex>
    <Flex marginTop={"20px"} justifyContent="center" gap="1rem">
        <Button className="button" onClick={() => {
            console.log("Button clicked, current gameComments:", gameComments);
            updateGameScoreCommentsFunction(gameScoreID);
        }}>Submit Comment</Button>
    </Flex>
            <View className="modal-from-top-close" paddingTop="10px" textAlign={"center"} width={"100%"}>
                <Button className="close small dark" onClick={() => {
                    console.log("Close clicked, current gameComments:", gameComments);
                    updateGameScoreCommentsFunction(gameScoreID);
                }}>close</Button>
            </View>
        </>
    )
}