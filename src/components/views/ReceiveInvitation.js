import PropTypes from "prop-types";
import {Button} from 'components/ui/Button';
import {fetchUserById} from 'helpers/restApi';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import {connect} from "../../helpers/WebSocketFactory";
import "styles/views/PopUp.scss";
import "styles/ui/Invitation.scss";
import Invitation from "../../models/Invitation";

const ReceiveInvitation = props => {
    const [invitation, setInvitation] = useState(null);

    useEffect(() => {
        connect(handleInvite);
    }, []);

    const handleInvite = (msg) => {
        let obj = JSON.parse(msg);
        setInvitation(new Invitation(obj));
    }

    const receiveInvitation = () => {
        if (invitation) {
            return (
                <>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        <p>Someone has challenged you to a {invitation.quizType === "IMAGE" ? "image" : "trivia"} quiz!</p>
                        <div className="twoButtons button-container">
                            <Button>Decline</Button>
                            <Button>Accept</Button>
                        </div>
                    </div>
                </>
            );
        }
    }

    return (
        <>{receiveInvitation()}</> 
    );
};

export default ReceiveInvitation;