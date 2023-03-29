import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";

const Registration = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
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
        <>
            <BaseContainer className="registration container">
                <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
                />
                <FormField
                label="Email"
                value={email}
                onChange={e => setEmail(e)}
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
                        disabled={!username || !password || !email || (password !== retypePassword)}
                        width="100%"
                        onClick={() => doRegistration()}
                    >
                    Create account
                    </Button>
                </div>

            </BaseContainer>
            <BaseContainer className="registration container secondary">
                Already have an account? <Link to="/login">Sign in here.</Link>
            </BaseContainer>
        </>
    );
};

export default Registration;
