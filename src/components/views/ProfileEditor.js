import React, {useEffect, useState} from 'react';
import {fetchUserById, handleError, updateUser} from 'helpers/restApi';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "./HomeHeader";
import ReceiveInvitation from './ReceiveInvitation';


const FormField = props => {
    return (
        <div className="login field">
            <label className="login label"
                   hidden={props.hidden}
            >
                {props.label}
            </label>
            <input
                className="login input"
                placeholder={props.value}
                value={props.value}
                type={props.type}
                hidden={props.hidden}
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
    onChange: PropTypes.func
};

const ProfileEditor = props => {


    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    let { user_id } = useParams();

    const commitChanges = async () => {
        try {
            await updateUser(user_id, username, profilePicture);

            history.push(`/users/` + user_id);
        } catch (error) {
            alert(`Something went wrong during commitment of the changes: \n${handleError(error)}`);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(user_id);

                // Get the returned users and update the state.
                const user = new User(userData);

                setUsername(user.username);
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


    let editorFields = <div>waiting</div>;

    if (username !== null) {
        editorFields = (
            <div>
                <h2>Edit your Profile:</h2>
                <FormField
                    label="Username:"
                    value={username}
                    onChange={un => setUsername(un)}
                />
                <FormField
                    label="Profile Picture:"
                    value={profilePicture}
                    onChange={pp => setProfilePicture(pp)}
                />
            </div>
        );
    }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer>
                {editorFields}
                <div style={{display:"inline-block"}}>
                    <Button
                        style={{color:"red", float:"left"}}
                        width="49%"
                        onClick={() => history.push('/users/' + user_id)}
                    >
                        Abort and go back
                    </Button>
                    <Button
                        style={{color:"darkgreen", float:"right"}}
                        width="49%"
                        hidden={false}
                        disabled={!username || !profilePicture}
                        onClick={() => commitChanges()}
                    >
                        Save changes
                    </Button>
                </div>
            </BaseContainer>
        </>

    );
}

export default ProfileEditor;
