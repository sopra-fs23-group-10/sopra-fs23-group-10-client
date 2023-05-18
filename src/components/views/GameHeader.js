import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "styles/views/GameHeader.scss";
import { Button } from "components/ui/Button";
import { cancelGame } from "helpers/restApi";
import { useHistory } from "react-router-dom";
import { connectGame, connectResult, disconnectGame, disconnectResult } from "helpers/WebSocketFactory";
import 'styles/ui/Invitation.scss';
import DropDown from "components/ui/DropDown";
import MusicInterface from "components/ui/MusicInterface";


const GameHeader = props => {
    const history = useHistory();
    const [cancelled, setCancelled] = useState(false);
    const [sentCancellation, setSentCancellation] = useState(false);
    const [showMusic, setShowMusic] = useState(false);

    useEffect(() => {
        connectGame(handleGameCancelled);
        connectResult(handleResult);

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener("popstate", onBackButtonEvent);

        return()=> {
            window.removeEventListener("popstate", onBackButtonEvent);
            disconnectGame();
            disconnectResult();
        }
    }, []);
    
    const handleResult = (msg) => {
        console.log("got result");
        let obj = JSON.parse(msg);
        const event = new CustomEvent("receivedResult", { detail: obj });
        document.dispatchEvent(event);
    }

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
    }

    const cancel = async () => {
        setSentCancellation(true);
        try {
            await cancelGame(localStorage.getItem('gameId'));
        } catch (error) {
            console.log(error);
            history.push("/home");
        }
    }

    const handleGameCancelled = (msg) => {
        setCancelled(true);
        const pauseEvent = new CustomEvent('pause', { detail: null });
        document.dispatchEvent(pauseEvent);
        const cancelledEvent = new CustomEvent('cancelled', { detail: null });
        document.dispatchEvent(cancelledEvent);
    }

    const ok = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        localStorage.removeItem('topics');
        localStorage.removeItem('sentAnswer');
        localStorage.removeItem('correctAnswer');
        localStorage.removeItem('startTime');
        localStorage.removeItem('result');
        localStorage.removeItem('topic');
        localStorage.removeItem('bothAnswered');
        localStorage.removeItem('answered');
        localStorage.removeItem('invitation');
        history.push("/home");
    }

    const gameCancelled = () => {
        if (cancelled) {
            return (
                <div className='invite-sent'>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        {sentCancellation ? <p>The game has been cancelled</p> : <p>Your opponent has cancelled the game.</p>}
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
                    {props.playerMode.charAt(0).toUpperCase() + props.playerMode.slice(1)} Mode <br />
                    Trivia Quiz
                </p>
            </div>
            <div className="gamecontentheader fontnormal" style={{textAlign: "left"}}>
                <p>
                    Score <br />
                    {props.questionId}/{localStorage.getItem('total_questions')}
                </p>
            </div>
            <div style={{textAlign: "right", gridColumn:4, position:"relative"}}>
                <div className="content nav-item" onClick={() => setShowMusic(!showMusic)}>
                    Music
                   
                </div>
                <DropDown centered={true} yOffset={60} show={showMusic} setShow={setShowMusic}>
                    <MusicInterface/>
                </DropDown>
            </div>

            {cancelButton()}
        </header>
    );
}

GameHeader.propTypes = {
    playerMode: PropTypes.string,
    height: PropTypes.number,
    questionId: PropTypes.string,
    showCancelButton: PropTypes.bool
};

export default GameHeader;
