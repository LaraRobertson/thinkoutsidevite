import {Button, Image, TextAreaField, View, Flex, Icon} from "@aws-amplify/ui-react";
import React from "react";
import {
    setCommentsFunction,
    goHome
} from "./helper";
import {useNavigate} from "react-router-dom";
import diary from "../assets/icons/noun-diary-6966311.svg";
import tornPaper from "../assets/icons/noun-torn-paper-3017230.svg";
import messageInABottle from "../assets/icons/noun-message-in-a-bottle-5712014.svg";
import clueIcon from "../assets/icons/noun-clue-4353248.svg";
import clueNoteIcon from "../assets/icons/noun-note-question-1648398.svg";
import envelope from "../assets/icons/noun-message-6963433.svg";

interface NotAvailableProps {
    authStatus: string;
}

interface CommentWindowProps {
    gameComments: string;
    setGameComments: (comments: string) => void;
}

interface IconClueDisplayProps {
    gameClueIcon: string;
    hide?: string;
}

export const NotAvailable: React.FC<NotAvailableProps> = ({ authStatus }) => {
    const navigate = useNavigate();
    return (
        <View>
            {authStatus === "configuring" ?
                (<View>Loading</View>) : (
                    <View>
                        <View textAlign="center">Admin is not available</View>
                        <Flex justifyContent="center">
                            <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                        </Flex>
                    </View>
                )}
        </View>
    )
}

export const GreenIcon: React.FC = () => {
    return (
        <Icon
            height="20px"
            width="20px"
            ariaLabel="CheckMark"
            viewBox={{ minX: 0, minY: 0, width: 500, height: 500 }}
            paths={[
                {
                    d: "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z",
                    fill: "#6c4",
                },
            ]}
        />
    )
}


export const CommentWindow: React.FC<CommentWindowProps> = (props) => {
    const navigate = useNavigate();
    return (
        <View className="cover-screen">
            <View className="winner comment-screen">
                <h3>Thank you for playing. </h3>
                We really want to know any and all comments you have about the game.
                <TextAreaField
                    label={""}
                    rows={6}
                    onChange={(e) => setCommentsFunction(e.currentTarget.value, props.setGameComments)}
                    descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                /><br />
                <Button className="button small" onClick={() => goHome(navigate, props.gameComments)}>Back to Games Page</Button>
            </View>
        </View>
    )
}

export const IconClueDisplay: React.FC<IconClueDisplayProps> = ({ gameClueIcon }) => {
    console.log("props.gameClueIcon: " + gameClueIcon);
    if (gameClueIcon !== "") {
        switch (gameClueIcon) {
            case "diary":
                return <Image height="70px" width="70px" src={diary} alt="diary" />;
            case "tornPaper":
                return <Image height="70px" width="70px" src={tornPaper} alt="torn paper" />;
            case "messageInABottle":
                return <Image height="70px" width="70px" src={messageInABottle} alt="message in a bottle" />;
            case "clueIcon":
                return <Image height="70px" width="70px" src={clueIcon} alt="clue icon" />;
            case "clueNoteIcon":
                return <Image height="70px" width="70px" src={clueNoteIcon} alt="clue Note icon" />;
            case "envelope":
                return <Image height="70px" width="70px" src={envelope} alt="envelope" />;
            default:
                return <Image height="70px" width="70px" src={tornPaper} alt="torn paper" />;
        }
    }
    return null;
}