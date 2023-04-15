import React from 'react';
//import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
//import {FormField} from "components/ui/FormField";
import HomeHeader from "./HomeHeader";


const Rules = props => {
    const history = useHistory();
    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    GAME RULES
                </div>
                <div className="content font" style={{textAlign: "left"}}>
                    <p>
                        Game Idea<br />
                        Brain Busters is a trivia game designed to entertain and educate players. It can be played as a single player but you also have the opportunity to challenge other players. The game offers two different game modes, the classical trivia game or the image game.
                        In classic trivia mode, questions are presented in text format, and players must select the correct answer from a list of 4 options. In the image mode however, instead of a text question, blurry pictures are gradually revealed, and players must correctly identify the image as quickly as possible. Both modes challenge players on quick decision-making, as there is a timer, which affects the amount of points players receive.
                        <br />
                        The overarching goal is to accumulate as many points as possible and to compete for the ultimate title of Brain Busters champion.<br />
                        <br />
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                        labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                        et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                        labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                        et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. <br />
                    </p>
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
