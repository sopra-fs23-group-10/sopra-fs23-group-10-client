import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Link, useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {FormField} from "components/ui/FormField";

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
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/login', requestBody);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);

            // Wait for token and id to be set to avoid errors in /Home
            await Promise.all([
                localStorage.getItem('token'),
                localStorage.getItem('id')
            ]);

            // Login successfully worked --> navigate to the route /home in the HomeRouter
            history.push(`/home`);
        } catch (error) {
            alert(`Something went wrong during login: \n${handleError(error)}`);
        }
    };

    return (
        <>
            <BaseContainer className="login container">
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
            <BaseContainer className="login container">
                <div className="login button-container">
                    <Button
                        width="100%"
                        onClick={() => history.push('/registration')}
                    >
                        No account yet?
                    </Button>
                </div>
            </BaseContainer>
        </>

    );

};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
