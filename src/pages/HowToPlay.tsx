import {View} from "@aws-amplify/ui-react";
import ZoneIconDark from "../assets/icons/zone.svg?react";
import PuzzleIconClosed from "../assets/icons/noun-locker-6097531.svg?react";
import TornPaper from "../assets/icons/noun-torn-paper-3017230.svg?react";
import Diary from "../assets/icons/noun-diary-6966311.svg?react";

export default function HowToPlay() {
    return (
        <>
            <section className={"main-container background-dark howtoplay"} >
                <h1>How To Play</h1>
                <h4>Review Example Game Below</h4>
                <div className="hero-column-container">
                    <div className={"hero-column"}>
                        <ul>
                            <li><strong>Zones: </strong>In this game there are 2 Zones (could be 1 or 10) - click on zone 2 for more puzzles and clues</li>
                            <li><strong>Zones</strong> are the center of the <strong>Play Area</strong>. For Zone 1 the center of the area is the sign. Clues and Hints in Zone 1 should reference
                                things within (or that you can see from) 100 feet of the center of Zone 1 area. Zone 2 is a different area and the Clues and Hints will reference things within that area.
                              </li>
                            <li>There should be an image and description of the center of the <strong>Zone</strong>.</li>
                            <li>There should be a map with a marker for the specific <strong>Zone</strong> (all the zones should be on the map in the game).</li>

                        </ul>
                    </div>
                    <div className={"hero-column"}>
                        <ul>
                            <li><strong>Puzzles</strong> will open a small window with 1 or more questions when you click the icon. You must answer all the questions to solve the <strong>Puzzle</strong>.</li>
                            <li>Click on the <strong>Clues</strong> to get information about how to answer the questions and solve the <strong>Puzzles</strong></li>
                            <li>Each <strong>Zone</strong> can have 1 or more <strong>Puzzles</strong> and <strong>Clues</strong>.
                            </li>
                            <li><strong>Hints</strong> should have better clues but 5 minutes is added to your score each time you use a <strong>Hint</strong>
                            </li>
                            <li>Note: the game tracks time started, hint time and number of puzzles solved.</li>
                            <li>Your <strong>Score</strong> is based on the amount of time it takes to complete the game plus hint time</li>

                        </ul>
                    </div>
                </div>
                <h4 style={{maxWidth:"500px", padding:"1rem"}}>The Leaderboard only records Scores for games you have played for the first time. If you start a game and hit quit, or don't complete it, then you will never get a chance for the leaderboard.</h4>
                <h5 style={{maxWidth:"700px", fontWeight:"normal", padding:"1rem"}}>
                    The game always asks for a team name even if 1 person - Leaderboard display is based on your team name. If more than one person (team) wants to play the game then 1 person (leader) with 1 login must start the game.
                    The other team members can then start the game with the same login (they can log in before starting the game).
                    What this does is give other members access to the game information/puzzles/clues to
                    help the leader enter the right answers.
                    The leader's score (if it is their first time) will be recorded if that person finishes the game first. </h5>

            </section>
            <section className={"main-container background-dark howtoplay"}>
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
        </section>
        </>
    )
}