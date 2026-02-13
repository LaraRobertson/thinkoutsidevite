import {View} from "@aws-amplify/ui-react";
import ZoneIconDark from "../assets/icons/zone.svg?react";
import PuzzleIconClosed from "../assets/icons/noun-locker-6097531.svg?react";
import TornPaper from "../assets/icons/noun-torn-paper-3017230.svg?react";
import Diary from "../assets/icons/noun-diary-6966311.svg?react";

export default function HowToPlay() {
    return (
        <div className="howtoplay background-light">
            <h1>How To Play</h1>

            <div><strong>This is an example game below</strong><br />
                There are 2 Zones - click on zone 2 for more puzzles and clues<br />
                The image shows the center of zone 1 and the description helps you find it<br />
                click on Puzzle to see what the questions are<br />
                click on the Clues to help solve the Puzzle<br />
                if you need a hint - click on hint</div>
            <div className="game-example">
                <View>

                    <div className="game-container background-light center">
                        <div style={{textAlign: "center", fontWeight: "bold", fontSize: "1.2em"}}>Mission: <span className="mission" data-wp-text="context.mission">To Win Game</span></div>
                        <div className="button-bar"><button className="button background-light ">Zone Map</button><button className="button background-light ">Switch to Dark</button><button className="button background-light ">Help</button><button className="button background-light ">Quit</button></div>
                        <div className="puzzle-solved" >Puzzles Solved? <span>0</span>/<span>2</span></div>
                        <div aria-label="Time" className="time time-change"><div className="small">time started: 02/12/26 6:19PM | hint time: 0</div></div>
                        <div className="top-bar top-bar-change">
                            <h4>Select Zone:</h4>
                            <div className="game-item-holder">
                                <div aria-label="f1171096-368f-409a-b204-3110423ffa94" className="zone-border zone-icon-container"><ZoneIconDark height={30} width={30}/>
                                    <div className="zone-text">zone 1</div></div>
                                <div aria-label="492918a3-379d-4922-b6be-73d0e0354185" className="zone-icon-container"><ZoneIconDark height={30} width={30}/>
                                    <div className="zone-text">zone 2</div></div>
                            </div>
                        </div>
                        <div className="zone-name center">Zone 1 for test game</div>
                        <div className="play-area">
                            <div aria-label="zone_f1171096-368f-409a-b204-3110423ffa94" className="show">
                                <div className="zone-name center">description: <br />The center of this zone is the main sign for the park</div>
                                <div className={"center"}>
                                    <img src="https://escapeout.games/wp-content/uploads/2025/02/jaycee-park-sign-zone-image-10-150x150.jpg" />
                                </div>
                            </div>

                            <h4 className={"center"}>Select Puzzle:</h4>
                            <div className="game-item-holder">
                                <div className="show game-item puzzle-not-solved">
                                    <PuzzleIconClosed className={"light-background "} height={50} width={50}/>
                                </div>
                            </div>

                            <h4 className={"center"}>Select Clue:</h4>
                            <div className="game-item-holder">
                                <div aria-label="Clue 1" className="game-item clue0">
                                    <Diary
                                        className={"light-background "} height={70} width={70}/>
                                </div>
                                <div aria-label="Clue 2" className="game-item clue0"><TornPaper
                                    className={"light-background "} height={70} width={70}/></div>
                            </div>
                            <h4 className={"center"}>Select Hint:</h4>
                            <div className="game-item-holder">
                                <div aria-label="test hint" className="game-item hint1">
                                    <div>test hint</div>
                                </div>
                            </div>
                        </div>
                    </div>


                </View>
            </div>
        </div>
    )
}