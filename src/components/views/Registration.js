import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = props => {
    return (
        <div className="registration field">
            <label className="registration label">
                {props.label}
            </label>
            <input
                className="registration input"
                placeholder={"enter your " + props.label.toLowerCase()}
                value={props.value}
                type={props.type}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};


const Registration = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [retypePassword, setRetypePassword] = useState(null);

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/users', requestBody);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);

            // Wait for token and id to be set to avoid errors in /Home
            await Promise.all([
                localStorage.getItem('token'),
                localStorage.getItem('id')
            ]);

            history.push(`/home`);
        } catch (error) {
            alert(`Something went wrong during registration: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <h2>Registration</h2>
            <FormField
              label="Username"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormField
                label="Password"
                value={password}
                type="password"
                onChange={pw => setPassword(pw)}
            />
            <FormField
                label="Confirm password"
                value={retypePassword}
                type="password"
                onChange={rp => setRetypePassword(rp)}
            />
            <div className="registration button-container">
                <Button
                    disabled={!username || !password || (password !== retypePassword)}
                    width="100%"
                    onClick={() => doRegistration()}
                >
                  Create account
                </Button>
            </div>
            <div className="registration button-container">
                <Button
                    width="100%"
                    onClick={() => history.push('/login')}
                >
                  Return to login page
                </Button>
            </div>
        </BaseContainer>
    );
};

export default Registration;
