import React, {useState} from 'react';
//import {api, handleError} from 'helpers/api';
//import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
//import {FormField} from "components/ui/FormField";
import {useHistory} from "react-router-dom";


const Rules = props => {
    const history = useHistory();
    return (
        <>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    GAME RULES
                </div>
                <div className="content" style={{textAlign: "left"}}>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <Button
                    width="100%"
                    onClick={() => history.push('/home')}
                >
                    DONE
                </Button>
            </BaseContainer>

        </>
    );
};


export default Rules;
