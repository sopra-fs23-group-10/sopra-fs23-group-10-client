import {Button} from 'components/ui/Button';
import {fetchUserById, answerInvite} from 'helpers/restApi';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import {connectInvitations} from "../../helpers/WebSocketFactory";
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
    const [time, setTime] = useState(0);
    const [timerExpired, setTimerExpired] = useState(false);

    useEffect(() => {
        connectInvitations(handleInvite, handleAnswer);
    }, []);

    const handleInvite = async (msg) => {
        let obj = JSON.parse(msg);
        let inv = new Invitation(obj)
        await getInvitingUser(inv.invitingUserId);
        setInvitation(inv);
        console.log(obj);
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
        console.log("handle answer");
        setInvitation(null);
        setUsername("");
        if (props.onAnswer) props.onAnswer(msg);
    }

    const reply = async (accepted) => {
        const response = await answerInvite(invitation.gameId, accepted);
        setInvitation(null);
        setUsername("");
        if (response[invitation.gameId]) {
            goToGame();
        }
    }

    const goToGame = async () => {
        console.log('gameId: ' + invitation.gameId);
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        localStorage.removeItem('selecting');

        localStorage.setItem('gameId', invitation.gameId);
        localStorage.setItem('question_nr', 1);
        localStorage.setItem('selecting', 'true');
        console.log("invitation selecting: " + localStorage.getItem('selecting'));
        // await Promise.all([
        //     localStorage.getItem('gameId'),
        //     localStorage.getItem('question_nr'),
        //     localStorage.getItem('selecting')
        // ]);
        history.push('/topic-selection');
    }

    const getTime = (time) => {
        setTime(time);
    }

    const receiveInvitation = () => {
        if (invitation) {
            return (
                <div className="invitation-received">
                    <div className="invitation overlay"></div>
                    <div className="invitation base-container">
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
                                timeLimit={200}
                                timeOut={() => reply(false)}
                                getTime={getTime}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };


    return (
        <>{receiveInvitation()}</>
    );
};

ReceiveInvitation.propTypes = {
    onAnswer: PropTypes.func
};

export default ReceiveInvitation;
