import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import { registerUser } from '../../helpers/restApi';

const Registration = props => {

    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [retypePassword, setRetypePassword] = useState(null);

    const doRegistration = async () => {
        try {
            if (!validateEmailFormat(email)) {
                alert("Email format is incorrect");
                return;
            }
            const response = await registerUser(username, password, email);
            history.push(`/home`);

        } catch (error) {
            alert(error.message);
        }
    };

    const validateEmailFormat = (email) => {
        const emailPattern = new RegExp('[a-zA-Z0-9.]+@[a-zA-Z]+.[a-zA-Z]+');
        return emailPattern.test(email);
    }

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
                <Button
                    disabled={!username || !password || !email || (password !== retypePassword)}
                    width="100%"
                    onClick={() => doRegistration()}
                >
                Create account
                </Button>
            </BaseContainer>
            <BaseContainer className="registration container secondary">
                Already have an account? <Link to="/login">Sign in here.</Link>
            </BaseContainer>
        </>
    );
};

export default Registration;
