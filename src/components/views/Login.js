import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {FormField} from "components/ui/FormField";
import { loginUser } from '../../helpers/restApi';
import HomeHeader from "./HomeHeader";
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

    const doLogin = async () => {
        try {
            const response = await loginUser(username, password);
            history.push(`/home`);
        } catch (error) {
            alert(error.message);
        }
    };

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
                        <Link to="/forgotPassword" style={{textAlign: "right"}}>Forgot Password?</Link>
                    </div>
                    <FormField
                        value={password}
                        type="password"
                        onChange={pw => setPassword(pw)}
                    />
                </>
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

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
