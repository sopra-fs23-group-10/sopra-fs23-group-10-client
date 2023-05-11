import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import { loginUser } from '../../helpers/restApi';
import HeaderAuthentication from "./HeaderAuthentication";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Login = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [msg, setMsg] = useState("");

    const doLogin = async () => {
        try {
            setMsg("");
            await loginUser(username, password);
            history.push(`/home`);
        } catch (error) {
            if (error.response.status === 404) {
                setMsg("Sorry, this username does not exist.");
            } else if (error.response.status === 406) {
                setMsg("Sorry, this password is incorrect.");
            } else {
                alert(error);
            }
        }
    };

    const error = () => {
        return (
            <div className='error'>{msg}</div>
        );
    }

    return (
        <>
            <HeaderAuthentication height="100"/>
            <BaseContainer className="login container">
                <FormField
                    label="Username"
                    value={username}
                    onChange={un => setUsername(un)}
                />
                <>
                    <div className="label-container">
                        Password
                        <Link to="/resetpassword" style={{textAlign: "right"}}>Forgot Password?</Link>
                    </div>
                    <FormField
                        value={password}
                        type="password"
                        onChange={pw => setPassword(pw)}
                    />
                </>
                {error()}
                <div className="login button-container">
                    <Button
                        disabled={!username || !password}
                        width="100%"
                        onClick={() => doLogin()}
                    >
                        SIGN IN
                    </Button>
                </div>
            </BaseContainer>
            <BaseContainer className="login container secondary">
                No account yet? <Link to ="/registration">  Register here.</Link>
            </BaseContainer>
        </>

    );

};

export default Login;
