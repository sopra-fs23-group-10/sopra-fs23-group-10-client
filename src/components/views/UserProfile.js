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
import clickable_edit from "images/clickable_edit.svg";


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
                setProfilePicture(user.profilePicture);
            } catch (error) {
                console.error(error.message);
                alert("Something went wrong while fetching the user data! See the console for details.");
            }
        }
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    let profileFields = <FormField
        label="Username:"
        visible = {true}
        value=""
    />

    if (profilePicture) {
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
                if (error.status === 409) { setMsg("Sorry, but the username is taken"); }
                else {
                    alert(error);
                }
            }
        }
        else{
            history.push('/home');
        }
    }

    const error = () => {
        return (
            <div className='error'>{msg}</div>
        );
    }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container boing-intro">
                <div className="user-profile container">
                    <div className = "title-location" style={{ gridColumn: '1 / span 2', textAlign: 'center' }} >
                        <div className="title"> <strong> EDIT PROFILE </strong></div>
                    </div>
                    <div className="picture-location">
                        <div className="profile-picture-container">
                            <Link to={`/users/${user_id}/profilepicture`}>
                                <Identicon className="picture" string={profilePicture} size={100} style={{ backgroundColor: 'lightgray' }}/>
                                <img className='edit-icon' src={clickable_edit}></img>
                            </Link>
                        </div>

                    </div>
                    <div className="form-location">
                        {profileFields}
                    </div>
                    {error()}
                </div>
                <div style ={{height: '12px'}}> </div>
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
