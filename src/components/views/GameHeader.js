import React from "react";
import PropTypes from "prop-types";
import "styles/views/GameHeader.scss";
import { Button } from "components/ui/Button";
import { cancelGame } from "helpers/restApi";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectGame } from "helpers/WebSocketFactory";
import 'styles/ui/Invitation.scss';

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const GameHeader = props => {
    const history = useHistory();
    const [cancelled, setCancelled] = useState(false);
    const [sentCancellation, setSentCancellation] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        connectGame(handleGameCancelled);
    }, [result]);

    const cancel = async () => {
        setSentCancellation(true);
        try {
            const response = await cancelGame(localStorage.getItem('gameId'));
            console.log(response);
        } catch (error) {
            console.log(error);
            history.push("/home");
        }
    }

    const handleGameCancelled = (msg) => {
        console.log(msg);
        setCancelled(true);
        const event = new CustomEvent('pause', { detail: null });
        document.dispatchEvent(event);
    }

    const ok = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        history.push("/home");
    }

    const gameCancelled = () => {
        if (cancelled) {
            return (
                <div className='invite-sent'>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        {sentCancellation ? <p>You have successfully cancelled the game</p> : <p>Your opponent has cancelled the game.</p>}
                        <div className="button-container">
                            <Button width="100%" onClick={() => ok()}>Ok</Button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <header className="gameheader container">
            <div className="gamecontentheader fontnormal" style={{textAlign: "left"}}>
                <p>
                    DuelMode <br />
                    Trivia Quiz
                </p>
            </div>
            <div className="gamecontentheader fontnormal" style={{textAlign: "left"}}>
                <p>
                    Score <br />
                    {props.questionId}/10
                </p>
            </div>
            <div className="content" style={{textAlign: "right", gridColumn:4}}>
                Music
            </div>
            <Button width="100%" onClick={() => cancel()} style={{gridColumn:5}}>Cancel Game</Button>
            {gameCancelled()}
        </header>
    );
}

GameHeader.propTypes = {
    height: PropTypes.number,
    questionId: PropTypes.string,
};

export default GameHeader;
