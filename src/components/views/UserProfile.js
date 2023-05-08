import React, {useEffect, useState} from 'react';
import {fetchUserById} from 'helpers/restApi';
import User from 'models/User';
import {Link, useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "./HomeHeader";
import ReceiveInvitation from './ReceiveInvitation';
import 'styles/views/PopUp.scss';
import Identicon from "react-identicons";
import { updateUser } from '../../helpers/restApi';
import user from "models/User";


const FormField = props => {
    return (
        <div className="user-profile field">
            <label className="user-profile label"
                   hidden={props.hidden}
            >
                {props.label}
            </label>
            <input
                className="user-profile input"
                placeholder={"Oops, some data should be here..."}
                value={props.value}
                type={props.type}
                hidden={props.hidden}
                disabled={props.disabled}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};


const UserProfile = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [originalUsername, setoriginalUsername] = useState (null);
    const [status, setStatus] = useState(null);
    const [points, setPoints] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [msg, setMsg] = useState("");

    let { user_id } = useParams();

    console.log(user_id);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(user_id);
                const user = new User(userData);
                setUsername(user.username);
                setoriginalUsername(user.username);
                setStatus(user.status);
                setPoints(user.points);
                setProfilePicture(user.profilePicture);
            } catch (error) {
                console.error(error.message);
                alert("Something went wrong while fetching the user data! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let profileFields = <div>waiting</div>;

    if (username) {
        profileFields = (
            <div>
                <FormField
                    label="Username:"
                    visible = {true}
                    value={username}
                    onChange={un => setUsername(un)}
                />
            </div>
        );
    }

    const checkChanges = async () => {
        if (username !== originalUsername){
            try {
                console.log(username);
                console.log(originalUsername);
                setMsg("");
                await updateUser (user_id, username, profilePicture);
                history.push('/home');
            } catch (error) {
                console.log(error);
                if (error.response.status === 409) { setMsg("Sorry, but the username is taken"); }
                else {
                    alert(error);
                }
            }
        }
        else{
            history.push('/home');
        }
    }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className="user-profile container">
                    <div className = "title-location" style={{ gridColumn: '1 / span 2', textAlign: 'center' }} >
                        <div className="title"> <strong> EDIT PROFILE </strong></div>
                    </div>
                    <div className="picture-location">
                        <Identicon className="profile-picture" string={profilePicture} size={140}/>
                    </div>
                    <div className="form-location">
                        {profileFields}
                    </div>

                </div>
                <Link to="/resetpassword" style={{textAlign: "right"}}>Change Password</Link>

                    <Button
                        disabled={!username || !profilePicture}
                        width="100%"
                        style={{marginTop: "12px"}}
                        onClick={() => checkChanges()}
                    >
                        Done
                    </Button>
            </BaseContainer>
        </>

    );
}

export default UserProfile;
