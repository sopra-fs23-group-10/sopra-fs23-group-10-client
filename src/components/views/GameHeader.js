import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "styles/views/GameHeader.scss";
import { Button } from "components/ui/Button";
import { cancelGame } from "helpers/restApi";
import { useHistory } from "react-router-dom";
import { connectGame, connectResult } from "helpers/WebSocketFactory";
import 'styles/ui/Invitation.scss';


const GameHeader = props => {
    const history = useHistory();
    const [cancelled, setCancelled] = useState(false);
    const [sentCancellation, setSentCancellation] = useState(false);

    useEffect(() => {
        connectGame(handleGameCancelled);
        connectResult(handleResult);

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener("popstate", onBackButtonEvent);

        return()=> {
            window.removeEventListener("popstate", onBackButtonEvent);
        }
    }, []);
    
    const handleResult = (msg) => {
        let obj = JSON.parse(msg);
        let res = obj[obj.length-1];
        const event = new CustomEvent("receivedResult", { detail: res });
        document.dispatchEvent(event);
    }

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
    }

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
        localStorage.removeItem('topics');
        localStorage.removeItem('answered');
        localStorage.removeItem('startTime');
        localStorage.removeItem('result');
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

    const cancelButton = () => {
        if (props.showCancelButton){
            return (
                <>
                    <Button width="100%" onClick={() => cancel()} style={{gridColumn:5}}>Cancel Game</Button>
                    {gameCancelled()}
                </>
            )
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
            {cancelButton()}
        </header>
    );
}

GameHeader.propTypes = {
    height: PropTypes.number,
    questionId: PropTypes.string,
    showCancelButton: PropTypes.bool
};

export default GameHeader;
