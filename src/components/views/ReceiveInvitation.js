import {Button} from 'components/ui/Button';
import {fetchUserById, answerInvite, handleError} from 'helpers/restApi';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import {connectInvitations, disconnectInvitations} from "../../helpers/WebSocketFactory";
import "styles/views/PopUp.scss";
import "styles/ui/Invitation.scss";
import Invitation from "../../models/Invitation";
import {useHistory} from 'react-router-dom';
import PropTypes from "prop-types";
import {Timer} from "../ui/Timer";

const ReceiveInvitation = props => {
    const history = useHistory();
    const [invitation, setInvitation] = useState(null);
    const [username, setUsername] = useState("");
    const [msg, setMsg] = useState(false);

    useEffect(() => {
        connectInvitations(handleInvite, handleAnswer);
        window.addEventListener('beforeunload', handleReload);
        return () => {
            window.removeEventListener('beforeunload', handleReload);
            disconnectInvitations();
        };
    }, [invitation]);

    const handleInvite = async (msg) => {
        let obj = JSON.parse(msg);
        let inv = new Invitation(obj)
        localStorage.setItem('gameId', inv.gameId);
        await getInvitingUser(inv.invitingUserId);
        setInvitation(inv);
        localStorage.setItem("invitation", true);
    }

    const handleReload = () => {
        localStorage.removeItem("invitation");
        localStorage.removeItem("answered");
        if (localStorage.getItem('gameId')) {
            try {
                localStorage.removeItem('startTime');
                const response = answerInvite(localStorage.getItem('gameId'), false);
                const event = new CustomEvent("sendReply", { detail: false });
                document.dispatchEvent(event);
            } catch (error) {
                handleError(error);
                console.log(error);
                alert(error);
            }
        }
    }

    const getInvitingUser = async(id) => {
        try {
            const userData = await fetchUserById(id);
            setUsername(userData.username);
        } catch (error) {
            alert(error);
        }
    }

    const handleAnswer = (msg) => {
        const accepted = JSON.parse(msg)[localStorage.getItem('gameId')];
        if (!accepted) {
            if (localStorage.getItem("invitation")) {
                if (localStorage.getItem("answered")) setMsg("You declined the invitation");
                else setMsg("The invitation was cancelled");
            } else {
                if (localStorage.getItem("answered")) setMsg("You cancelled the invitation");
                else setMsg("The invitation was declined")
            }
            setTimeout(() => { 
                const event = new CustomEvent("endPopup", { detail: null });
                document.dispatchEvent(event);
                setMsg(null); 
            }, 1000);
        }

        localStorage.removeItem("invitation");
        localStorage.removeItem("answered");
        setInvitation(null);
        setUsername("");
        if (!accepted) {
            localStorage.removeItem('gameId');
        }
        throwReply(msg);
        if (props.onAnswer) props.onAnswer(msg);
    }

    const reply = async (accepted) => {
        localStorage.setItem("answered", true);
        const response = await answerInvite(invitation.gameId, accepted);
        if (response[invitation.gameId]) {
            goToGame().catch(error => {
                console.error(error);
            });
        }
        const event = new CustomEvent("sendReply", { detail: accepted });
        document.dispatchEvent(event);
    }

    const goToGame = async () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        localStorage.removeItem('startTime');

        localStorage.setItem('question_nr', 0);
        localStorage.setItem('gameId', invitation.gameId);

        history.push(`/topic-selection/duel/${invitation.quizType.toLowerCase()}/selecting`);
    }

    const throwReply = (msg) => {
        const event = new CustomEvent("receiveReply", { detail: msg });
        document.dispatchEvent(event);
    }

    const content = () => {
        if (!msg) {
            return (
                <>
                    <p>
                        {username} has challenged you to a{" "}
                        {invitation.quizType === "IMAGE" ? "image" : "trivia"} quiz!
                    </p>
                    <div className="twoButtons button-container">
                        <Button onClick={() => reply(false)}>Decline</Button>
                        <Button onClick={() => reply(true)}>Accept</Button>
                    </div>
                    <div className='font-black'>
                        <Timer
                            timeLimit={60}
                            timeOut={() => reply(false)}
                        />
                    </div>
                </> 
            );
        } else {
            return (
                <>
                    <p>
                        {msg}
                    </p>
                </>
            );
        }
    }

    const receiveInvitation = () => {
        if (invitation || msg) {
            return (
                <div className="invitation-received">
                    <div className="invitation overlay"></div>
                    <div className="invitation base-container">
                       {content()}
                    </div>
                </div>
            );
        }
    };

    return (
        <>{receiveInvitation()}</>
    );
};

Timer.propTypes = {
    onAnswer: PropTypes.func,
};

export default ReceiveInvitation;
