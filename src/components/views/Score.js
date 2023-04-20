import GameHeader from "components/views/GameHeader";
import { fetchUsersInGame, getTopicSelection, fetchUserById, getIntermediateResults, handleError, getQuestion } from "helpers/restApi";
import React, {useEffect, useState} from 'react';
import { useHistory, useLocation, useParams } from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import Result from "../../models/Result";
import BaseContainer from "components/ui/BaseContainer";
import { Timer } from "components/ui/Timer";
import 'styles/views/TopicSelectionDuel.scss';
import {connectGame} from "../../helpers/WebSocketFactory";
import Question from "models/Question";



const Score = props => {
    const history = useHistory();
    const [topics, setTopics] = useState(null);
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const [time, setTime] = useState(0);

    useEffect(() => {
        connectGame(handleQuestion);
        async function fetchTopics() {
            console.log("selecting tooooopics")
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }

        async function fetchGame() {
            try {
                if (localStorage.getItem('question_nr') <= 1) {
                    const response = await fetchUsersInGame(localStorage.getItem("gameId"));
                    let res = new Result(response.data);
                    setResult(res);
                    await getUser(response.data.invitedPlayerId, setUsernameInviting);
                    await getUser(response.data.invitingPlayerId, setUsernameInvited);
                } else {
                    const response = await getIntermediateResults(localStorage.getItem("gameId"));
                    let points1;
                    let points2;
                    for (let i = 0; i < response.data.length; i++) {
                        points1 = response.data[i].invitedPlayerResult;
                        points2 = response.data[i].invitingPlayerResult;
                    }
                    let res = new Result(response.data[0]);
                    res.invitedPlayerId = points1;
                    res.invitingPlayerId = points2;
                    setResult(res);
                    await getUser(response.data[0].invitedPlayerId, setUsernameInvited);
                    await getUser(response.data[0].invitingPlayerId, setUsernameInviting);
                }
            } catch (error) {
                alert(`Something went wrong while fetching the result, ${handleError(error)}`);
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

        console.log('selecting: ' + localStorage.getItem('selecting'));
        if (localStorage.getItem('selecting') === "true") {
            console.log("selecting hajdhfaehuifauih");
            fetchTopics();
        }
        fetchGame();
    }, []);

    const fetchQuestion = async (topic) => {
        try {
            const response = await getQuestion(localStorage.getItem('gameId'), topic);
            const q = new Question(response);
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    }

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const toQuestion = (question) => {
        history.push({
            pathname: '/game',
            search: "?update=true",
            state: {
                question: question
            },
        });
    }

    const timeOut = () => {
        if (localStorage.getItem('selecting')) {
            rndTopic();
        }
    }

    const rndTopic = () => {
        let rnd = getRandomInt(0, 3);
        fetchQuestion(topics[rnd]); 
    }
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    const getTime = (time) => {
        setTime(time);
    }

    const handleQuestion = (msg) => {
        const question = new Question(JSON.parse(msg));
        toQuestion(question);
    }

    const drawTopics = () => {
        if (localStorage.getItem('selecting') && topics) {
            return (
                <>
                    <div className="grid-2">
                        <div className="title grid2" style={{textAlign: "left"}}>
                            Select a topic
                        </div>
                        {topics && topics.map((topic, index)=> (
                            <div className={'topicSelection column-${index+1}'}>
                                <GameButton callback={() => fetchQuestion(topic)} text={parseString(topic)}/>
                            </div>
                        ))}
                    </div>
                </>
            );
        } else if (!localStorage.getItem('!selecting')) {
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
                            {result.invitingPlayerResult}
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
            <><GameHeader questionId={localStorage.getItem('question_nr')} height="100"/></>
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
