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
                            <View paddingBottom="10px"><strong>You must solve all the Puzzles in all the Zones to win!
                            </strong></View>
                            <View paddingBottom="10px">Zone centers are supposed to be the Zone image and/or the
                                marker on the Map for that Zone and Clues can be anywhere in that area.</View>
                            <View paddingBottom="10px">Zones have a radius of about 150 feet or so with the image or map icon as center.</View>
                            <View paddingBottom="10px">
                                Tap on clues to open to give you information which will enable you to solve puzzles.</View>
                            <View paddingBottom="10px">Click on <strong>All Clues</strong> to figure out Puzzles and if a Clue says look 200 feet away from Zone center, then do that.</View>

                            <View paddingBottom="10px">Tap on Puzzles to open and then solve.</View>

                            <View paddingBottom="10px">Hints are better Clues but cost 5 minutes.</View>
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