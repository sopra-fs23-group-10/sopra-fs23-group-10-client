import GameHeader from "components/views/GameHeader";
import { fetchUsersInGame, getTopicSelection, fetchUserById } from "helpers/restApi";
import React, {useEffect, useState} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import { Points } from "components/ui/Points";
import Result from "../../models/Result";
import BaseContainer from "components/ui/BaseContainer";
import { Timer } from "components/ui/Timer";
import 'styles/views/TopicSelectionDuel.scss';
import {connectGame} from "../../helpers/WebSocketFactory";
import Question from "models/Question";



const Score = props => {
    const history = useHistory();
    const location = useLocation();
    const [topics, setTopics] = useState(null);
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const [time, setTime] = useState(0);

    useEffect(() => {
        console.log("gameId: " + localStorage.getItem('gameId'));
        connectGame(handleQuestion);

        async function fetchTopics() {
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.topics);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }

        async function fetchGame() {
            try {
                const response = await fetchUsersInGame(localStorage.getItem("gameId"));
                const res = new Result(response);
                setResult(res);
                console.log(response.data);
                await getUser(response.data.invitingPlayerId, setUsernameInviting);
                await getUser(response.data.invitedPlayerId, setUsernameInvited);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }

        const getUser = async(id, callback) => {
            try {
                const userData = await fetchUserById(id);
                callback(userData.username);
            } catch (error) {
                alert(error);
            }
        }

        if (location.state.turn) fetchTopics();
        fetchGame();
    }, []);

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const toQuestion = (str, turn, question) => {
        history.push({
            pathname: '/game',
            search: '?update=true',
            state: {
                turn: turn, 
                topic: str,
                nr: location.state.nr,
                question: question
            },
        });
    }

    const timeOut = () => {
        if (location.state.turn) {
            rndTopic();
        }
    }

    const rndTopic = () => {
        let rnd = getRandomInt(0, 3);
        toQuestion(topics[rnd]); 
    }
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const getTime = (time) => {
        setTime(time);
    }

    const handleQuestion = (msg) => {
        if (!location.state.turn) {
            console.log("HANDLE QUESTION");
            console.log(msg);
            const question = new Question(JSON.parse(msg));
            toQuestion(question.category, false, question);
        } else {
            console.log(msg);
        }
    }

    const drawTopics = () => {
        if (location.state.turn && topics) {
            return (
                <>
                    <div className="grid-2">
                        <div className="title grid2" style={{textAlign: "left"}}>
                            Select a topic
                        </div>
                        {topics && topics.map((topic, index)=> (
                            <div className={'topicSelection column-${index+1}'}>
                                <GameButton callback={() => toQuestion(topic, true)} text={parseString(topic)}/>
                            </div>
                            ))}
                    </div>
                </>
            );
        } else if (!location.state.turn) {
            return (
                <div className="background-topic_waiting">
                    <div className="topic">
                        Your opponent is selecting a topic.
                    </div>
                </div>
            );
        }
    }

    const drawResults = () => {
        console.log(result);
        if (result && usernameInvited && usernameInviting) {
            return (
                <div className="grid-1">
                    <div className="title" style={{textAlign: "left"}}>
                        Player 1
                    </div>
                    <div className="title" style={{textAlign: "right"}}>
                        Player 2
                    </div>
                    <div className="background-points">
                        <div className = "player" style={{textAlign: "center"}}>
                            {usernameInviting}
                        </div>
                        <div className = "points-score" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                    <div className="background-points">
                        <div className = "player" style={{textAlign: "center"}} >
                            {usernameInvited}
                        </div>
                        <div className = "points-score" style={{textAlign: "center"}}>
                            {result.invitedPlayerResult}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            <GameHeader questionId={location.state.nr} height="100"/>;
            <div className="ScreenGrid">
                {drawResults()}
                {drawTopics()}
                <div className="timing-location">
                    <Timer timeLimit={90} timeOut={timeOut} getTime={getTime}/>
                </div>

            </div>
        </>
    );
}

export default Score;
