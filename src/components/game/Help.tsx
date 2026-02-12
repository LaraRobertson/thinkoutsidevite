import {Accordion, View} from "@aws-amplify/ui-react";

export default function Help() {
    console.log("How to Play");
    return (
        <View className={"modal-middle"}>
            <Accordion.Container allowMultiple defaultValue={['how-to-play']}>
                <Accordion.Item value="how-to-play">
                    <Accordion.Trigger>
                        <strong>Generally How to Play</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                Tap on clues to open to give you information which will enable you to solve puzzles.</View>
                            <View paddingBottom="10px">Tap on puzzles to open and then solve.</View>
                            <View paddingBottom="10px">Clues reference things in each Zone area - usually within 100 feet</View>
                            <View paddingBottom="10px">Zones are near the Zone image on the screen and near the
                                marker on the Map for that Zone (within 100 feet or so).</View>
                            <View paddingBottom="10px">Hints are better clues but cost 5 minutes.</View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="layout">
                    <Accordion.Trigger>
                        <strong>How to Play Game (Detailed)</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
No more detail yet
                        </View>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Container>
        </View>
    )
}