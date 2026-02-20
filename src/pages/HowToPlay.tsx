import {ExampleGame} from "../components/ui/UIComponents.tsx";

export default function HowToPlay() {
    return (
        <>
            <section className={"main-container background-dark howtoplay"} >
                <h1>How To Play</h1>
                <h4>Review Example Game Below</h4>
                <h5>Zones are the play area. The particular Zone is the best place to find the answers to the Puzzles. The Clues reference things in their Zone.</h5>
                <div className="hero-column-container">
                    <div className={"hero-column"}>
                        <ul>
                            <li><strong>Zones: </strong>In this game there are 2 Zones (there could be 1 or 10) - click on Zone 2 for more puzzles and clues</li>
                            <li><strong>Zones</strong> are the center of the <strong>Play Area</strong>. For Zone 1 below the center of the area is the sign. Clues and Hints in Zone 1 should reference
                                things within (or that you can see from) approximately 150 feet of the center of Zone 1 area. Zone 2 is a different area and the Clues and Hints will reference things within that area.
                              </li>
                            <li>There should be an image and description of the center of the <strong>Zone</strong>.</li>
                            <li>There should be a map with a marker for the specific <strong>Zone</strong> (all the zones should be on the map in the game).</li>

                        </ul>
                    </div>
                    <div className={"hero-column"}>
                        <ul>
                            <li><strong>Puzzles</strong> will open a small window with 1 or more questions when you click the icon. You must answer all the questions to solve the <strong>Puzzle</strong>. You do not have to solve the puzzles linearly, you can solve a puzzle in Zone 2 before Zone 1, if you want.</li>
                            <li>To Win you have to solve <strong>ALL The Puzzles</strong> not just one final puzzle.</li>
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
                <ExampleGame />
        </section>
        </>
    )
}