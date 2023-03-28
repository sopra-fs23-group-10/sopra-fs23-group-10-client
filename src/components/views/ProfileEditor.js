import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import {Spinner} from "../ui/Spinner";
import PropTypes from "prop-types";


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
    const [birthdayDate, setBirthdayDate] = useState(null);

    let { user_id } = useParams();

    const commitChanges = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const requestBody = JSON.stringify({username, birthdayDate});
            await api.put(generatePath('/users/:userId', {userId: user_id}), requestBody, {headers: {token: authToken}});

            history.push(`/users/` + user_id);
        } catch (error) {
            alert(`Something went wrong during commitment of the changes: \n${handleError(error)}`);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const authToken = localStorage.getItem('token');
                const response = await api.get(generatePath('/users/:userId', {userId: user_id}), {headers: {token: authToken}});

                // Get the returned users and update the state.
                const user = new User(response.data);

                setUsername(user.username);
                setBirthdayDate(user.birthdayDate ? user.birthdayDate.split("T")[0] : null);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the user data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user data! See the console for details.");
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let editorFields = <Spinner/>;

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
                    type="date"
                    label="Birthday Date:"
                    value={birthdayDate}
                    onChange={bd => setBirthdayDate(bd)}
                />
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="user-profile container">
                <div className="user-profile form">
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
                            disabled={!username}
                            onClick={() => commitChanges()}
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default ProfileEditor;
