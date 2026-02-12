import {Accordion, Button, Heading, Image, View} from "@aws-amplify/ui-react";
import {useEffect, useState} from "react";
import {ModalMap} from "../../Modals";
import {Map} from "../../Map";
import type { GameDetails } from "../../../types/game";
import {dataService} from "../../../services/dataService.ts";

interface GameDetailProps {
    gameDetails: GameDetails;
    gameIntro?: string;
}

interface ModalContentMap {
    open: boolean;
    content: string;
}

export default function GameDetail(props: GameDetailProps) {
    const { gameDetails } = props;
    const [modalContentMap, setModalContentMap] = useState<ModalContentMap>({open: false, content: ""});
    const [gamePlayZoneImage, setGamePlayZoneImage] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchGamePlayZoneImage = async () => {
            try {
                const client = dataService.getClient();
                const { data: zones } = await client.models.GamePlayZone.list({
                    filter: {
                        gameID: { eq: gameDetails.gameID },
                        order: { eq: 1 }
                    }
                });
                if (zones.length > 0 && zones[0].gameZoneImage) {
                    setGamePlayZoneImage(zones[0].gameZoneImage);
                }
            } catch (err) {
                console.error("Error fetching GamePlayZone image:", err);
            }
        };

        fetchGamePlayZoneImage();
    }, []);
    return (
        <View className="game-details-content">
            <Heading level={5}>Goal:</Heading>
            <View className="end-paragraph">{gameDetails.gameGoals}</View>
            <Heading level={5}>Description:</Heading>
            <View className="end-paragraph">{gameDetails.gameDescription}</View>
            <Heading level={5}>Summary</Heading>
            <View className="end-paragraph">{gameDetails.gameSummary}</View>
            <Heading level={5}>This Game Starts Here at Zone 1:</Heading>
            <View className="end-paragraph">
                <Image alt={gameDetails.gameName} maxHeight="100px" src={gamePlayZoneImage}/><br />
                <Button className="quit-button dark"
                        onClick={() => setModalContentMap({
                            open: true,
                            content: "Map"
                        })}>
                    Location of First Zone on Map</Button>
                <br />You must find the other Zone Locations while playing the game.<br /><br />
            </View>
            <ModalMap isOpen={modalContentMap.open} setModalContentMap={setModalContentMap}>
                {(modalContentMap.content === "Map") && <Map gameDetails={gameDetails} gameIntro={true}/>}
            </ModalMap>
            <Accordion.Container allowMultiple defaultValue={['logistics']}>
                <Accordion.Item value="layout">
                    <Accordion.Trigger>
                        <strong>How to Play Game</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            Maybe show animated gif of someone playing
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="logistics">
                    <Accordion.Trigger>
                        <strong>Logistics</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                {gameDetails.gameLogisticInfo}
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="Scoring">
                    <Accordion.Trigger>
                        <strong>Scoring</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                Your score is your time. Time doesn't stop until you complete the
                                game. Using a Hint adds 5 minutes.
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="Hint">
                    <Accordion.Trigger>
                        <strong>Hints</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                Hints are basically better clues but they generally cost you time.
                                You will be warned if you choose to use a hint.
                                Choosing an Individual Hint adds <span
                                className="italics"> 5 Minutes!</span></View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Container>
        </View>
    );
}