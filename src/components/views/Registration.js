import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import { registerUser } from '../../helpers/restApi';
import HomeHeader from "./HomeHeader";
import HeaderAuthentication from "./HeaderAuthentication";

const Registration = props => {

    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [retypePassword, setRetypePassword] = useState(null);
    const [msg, setMsg] = useState("");

    const doRegistration = async () => {
        try {
            setMsg("");
            if (!validateEmailFormat(email)) { 
                setMsg("Please enter a valid email address."); 
                return;
            }
            const response = await registerUser(username, password, email);
            history.push(`/home`);
        } catch (error) {
            console.log(error);
            console.log(error.response);
            if (error.response.status == 409) { setMsg("Sorry, but this username is taken."); }
            else {
                alert(error);
            }
        }
    };

    const error = () => {
        return (
            <div className='error'>{msg}</div>
        );
    }

    const validateEmailFormat = (email) => {
        const emailPattern = new RegExp('[a-zA-Z0-9.]+@[a-zA-Z]+.[a-zA-Z]+');
        return emailPattern.test(email);
    }

    return (
        <>
            <HeaderAuthentication height="100"/>
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
                {error()}
                <div class="registration button-container">
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
