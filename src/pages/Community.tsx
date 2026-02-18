import {NavLink} from "react-router-dom";

export default function Community() {
        return (
        <>
            <section className={"main-container background-dark howtoplay"} >
                <h1>Community</h1>

                <div className="hero-column-container">
                    <div >
                        <h4>Play A Game!</h4>
                        <div>Find a game near you and <NavLink to="/#playgames">
                            play!
                        </NavLink> </div>

                        <h4>Build A Game!</h4>
                        <div><strong>Game Form:</strong> if you want to be a game builder the first thing is to come up with a game.</div>
                        <div>Can use this form as guide to build a game:</div>
                           <div style={{lineHeight:"3"}}><a href="/GameForm.html" className={"button background-light"}>Game Form</a></div>

                        <div><strong>Puzzle Worksheet:</strong> the second first thing is to come up with some Puzzles:</div>
                            <div style={{lineHeight:"3"}}><a href="/PuzzleWorksheet.html" className={"button background-light"}>Puzzle WorkSheet</a></div>

                            <div> need to fill out one of these for each Zone.</div>
                    </div>
                </div>
                <h4 style={{maxWidth:"500px", padding:"1rem"}}>For Now you can Print these Out and then Fill them out and send them (and whatever images) to us and we can build the game - the digital interface is not ready yet.</h4>
                <h5 style={{maxWidth:"700px", fontWeight:"normal", padding:"1rem"}}>
                    Also, it is easier to get out there with these worksheets and design the game. Even if there was a digital interface this would probably be the first step.</h5>
            </section>
            </>
    )
}