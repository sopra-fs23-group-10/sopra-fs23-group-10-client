import React, {useEffect, useState} from 'react';
import {fetchUserData} from 'helpers/api';
import User from 'models/User';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


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
    const [status, setStatus] = useState(null);
    const [creationDate, setCreationDate] = useState(null);
    const [birthdayDate, setBirthdayDate] = useState(null);

    let { user_id } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserData(user_id);

                const user = new User(userData);

                setUsername(user.username);
                setStatus(user.status);
                const reformDate = user.creationDate.slice(0, 16).split("T");
                reformDate[0] = reformDate[0].split("-");
                setCreationDate(
                    reformDate[0][2] +
                    "." +
                    reformDate[0][1] +
                    "." +
                    reformDate[0][0] +
                    " at " +
                    reformDate[1]
                );
                setBirthdayDate(user.birthdayDate ? user.birthdayDate.split("T")[0] : null);

                console.log('requested data:', userData);
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
                <h2>Profile of {username}:</h2>
                <FormField
                    label="Username:"
                    value={username}
                    disabled
                />
                <FormField
                    label="Online Status:"
                    value={status}
                    disabled
                />
                <FormField
                    label="Profile Creation Date:"
                    value={creationDate}
                    disabled
                />
                <FormField
                    type="date"
                    label="Date of birth:"
                    value={birthdayDate}
                    hidden={birthdayDate == null}
                    disabled
                />
            </div>
        );
    }

    return (
        <BaseContainer>
            {profileFields}
            <Button
                width="100%"
                hidden={localStorage.getItem('id') !== user_id}
                onClick={() => history.push('/users/edit/' + user_id)}
            >
                Edit profile
            </Button>
            &nbsp;
            <Button
                width="100%"
                onClick={() => history.push('/game')}
            >
                Back to dashboard
            </Button>
        </BaseContainer>
    );
}

export default UserProfile;
