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
                <div className="rulesGrid">
                    <div className="title_location">
                        <div className ="title" style={{textAlign: "center"}}>
                            <strong> GAME RULES </strong>
                        </div>
                    </div>
                    <div className ="content_location">
                        <div className="content font" style={{textAlign: "left"}}>
                            <p>
                                <strong> Game Idea </strong> <br />
                                Brain Busters is a trivia game designed to entertain and educate players. It can be played as a single player but you also have the opportunity to challenge other players. The game offers two different game modes, the classical trivia game or the image game.
                                In classic trivia mode, questions are presented in text format, and players must select the correct answer from a list of 4 options. In the image mode however, instead of a text question, blurry pictures are gradually revealed, and players must correctly identify the image as quickly as possible. Both modes challenge players on quick decision-making, as there is a timer, which affects the amount of points players receive.
                                <br />
                                The overarching goal is to accumulate as many points as possible and to compete for the ultimate title of Brain Busters champion.<br />
                                <br />
                                <strong> Set-Up </strong>
                                <br />
                                1. After a player pressed “Start Game” on the Home Screen, the player first has to choose between playing a trivia game or an image game.<br />
                                <br />
                                2. Afterwards the player can choose whether they want to play as a single player or against another player.<br />
                                <br />
                                3a.
                                Duel Mode<br />
                                If the player decides on duel mode, the player can either choose another online player to challenge or challenge a random player. Each player can however, also be challenged by other players at any given time, if the player is not in an a game.
                                Depending on who challenged who, this influences the course of the game in terms of topic selection, as the challenged player gets to pick the topic of the first game round.
                                Within the 10 question rounds, the topic selection will alternate between the two players after each question round. Every time, 3 random topics will appear, from which the players can choose from. In addition, the players will also receive an update on their current point scores.
                                <br />
                                <br /> 3b.Single Mode<br />
                                If the player decides on playing in single mode, they go directly into the topic selection.
                                The player has the opportunity to choose of the 10 topics and will play the 10 question rounds based on the topic of their choice. <br />
                                <br />
                                4. Upon game selection, the game begins!<br />
                                There will be 10 rounds of questions with 1 bonus round if a tie occurs.
                                For each round, either a question or a blurry image will occur depending on the game mode chosen.
                                For both game modes, time is of the essence, where more points will be awarded, the faster the question was answered.<br />
                                <br />
                            </p>
                        </div>
                    </div>
                    <div className ="button_location">
                        <Button
                            width="100%"
                            onClick={() => history.push('/home')}
                        >
                            DONE
                        </Button>
                    </div>
                </div>
            </BaseContainer>

        </>
    );
};

export default Rules;
