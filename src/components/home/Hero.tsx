import {NavLink} from "react-router-dom";

import {useState} from "react";

export default function Hero() {
    const [hideHero, setHideHero] = useState(false);
    return (
        <>
        <div className={hideHero? "hide" : "hero main-content"}>
            <div className={"hide"}>
                <h5>Go Outside and play and <span className="blue-light">Intriguing Problem-Solving Game</span> with your
                    family and friends!
                </h5>
                <div className="hero-paragraph">
                    Grab your phone, round up your family and friends, and head outside for a fun-filled day of
                    creative puzzles, exploration, and excitement!
                    <div className="italics">Games
                        are meant to be played on smartphone at locations in Game List below.</div>
                </div>
            </div>
            <div>
                <h1>Go Outside and play Unique and Puzzling Games</h1>
                <div className="flex-parent-center">
                    <button onClick={() => setHideHero(!hideHero)} className="button green-background-link" >
                        Play a Game
                    </button>
                    <NavLink to="/howtoplay" className="button light-purple-background" >
                        How To Play
                    </NavLink>
                </div>
            </div>
            <div className="hero-paragraph">Think Outside Games are designed to be played Outdoors</div>
            <div className={"hero-column-container"}>
                <div className={"hero-column"}>
                    <ul>
                        <li>They are designed to be played on location with your smartphone</li>
                        <li>Games can be timed for fun competition with friends and family</li>
                        <li>Games are meant to be played and <NavLink to="/community" >
                            made by a community
                        </NavLink> (anyone can make a game or play a game)
                        </li>
                        <li>Games are based on permanent things in the environment like signs, plaques, and other
                            permanent landmarks
                        </li>
                        <li>Game designers should not alter the environment: Leave No Trace</li>

                    </ul>
                </div>
                <div className={"hero-column"}>
                    <ul>
                        <li>All games should have clear answers and should require no outside knowledge except
                            reading, a sense of direction, critical thinking (and maybe some math)
                        </li>
                        <li>All games are different (different designers, different locations, different levels,
                            etc.) and each may have elements of geocaching, scavenger hunts, and escape room style
                            puzzles (like deciphering codes, solving logic problems, recognizing patterns, wordplay,
                            and critical thinking).
                        </li>
                        <li>“Take only memories, leave only footprints”</li>
                    </ul>
                </div>
            </div>
    </div>
            <button onClick={() => setHideHero(!hideHero)}>
                {hideHero ?
                    <div>show introduction</div> :
                    <div>hide introduction</div>
                }
            </button>
        </>
)
}