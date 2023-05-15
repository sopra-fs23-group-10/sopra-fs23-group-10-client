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
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        connectInvitations(handleInvite, handleAnswer);
        window.addEventListener('beforeunload', handleReload);
        return () => {
            window.removeEventListener('beforeunload', handleReload);
            disconnectInvitations();
        }   
    }, [invitation]);

    const handleInvite = async (msg) => {
        let obj = JSON.parse(msg);
        let inv = new Invitation(obj)
        localStorage.setItem('gameId', inv.gameId);
        await getInvitingUser(inv.invitingUserId);
        setInvitation(inv);
    }

    const handleReload = async () => {
        if (localStorage.getItem('gameId')) {
            try {
                localStorage.removeItem('startTime');
                const response = await answerInvite(localStorage.getItem('gameId'), false);
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
        if (accepted) {
            setCancelled(false);
            setInvitation(null);
            setUsername("");
        } else {
            setCancelled(true);
            setTimeout(() => reset(), 3000);
        }
        throwReply(msg);
        if (props.onAnswer) props.onAnswer(msg);
    }

    const reset = () => {
        console.log("RESET FROM RECEIVE INVITATION");
        setCancelled(false);
        setInvitation(null);
        setUsername("");
        localStorage.removeItem('gameId');
    }

    const reply = async (accepted) => {
        const response = await answerInvite(invitation.gameId, accepted);
        setInvitation(null);
        setUsername("");
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

        localStorage.setItem('question_nr', 1);
        localStorage.setItem('gameId', invitation.gameId);

        history.push(`/topic-selection/duel/${invitation.quizType.toLowerCase()}/selecting`);
    }

    const throwReply = (msg) => {
        const event = new CustomEvent("receiveReply", { detail: msg });
        document.dispatchEvent(event);
    }

    const content = () => {
        if (!cancelled) {
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
                    <div>
                        <Timer
                            display={true}
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
                        {username} cancelled the invitation
                    </p>
                </>
            );
        }
    }

    const receiveInvitation = () => {
        if (invitation) {
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
