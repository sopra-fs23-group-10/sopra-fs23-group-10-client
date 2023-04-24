import GameHeader from "components/views/GameHeader";
import { fetchUsersInGame, getTopicSelection, fetchUserById, getIntermediateResults, handleError, getQuestion } from "helpers/restApi";
import React, {useEffect, useState, useRef} from 'react';
import { useHistory, useParams } from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import Result from "../../models/Result";
import BaseContainer from "components/ui/BaseContainer";
import {connectQuestion} from "../../helpers/WebSocketFactory";
import 'styles/views/Score.scss';
import {connectGame} from "../../helpers/WebSocketFactory";
import Question from "models/Question";
import {Timer} from "../ui/Timer";


const Score = props => {
    const history = useHistory();
    const [topics, setTopics] = useState(null);
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    let { selecting } = useParams();

    useEffect(() => {
        connectQuestion(handleQuestion);
        async function fetchTopics() {
            console.log('fetch topics');
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }

        async function fetchGame() {
            try {
                if (parseInt(localStorage.getItem('question_nr')) <= 1) {
                    const response = await fetchUsersInGame(localStorage.getItem("gameId"));
                    let res = new Result(response.data);
                    setResult(res);
                    await getUser(response.data.invitedPlayerId, setUsernameInvited);
                    await getUser(response.data.invitingPlayerId, setUsernameInviting);
                } else {
                    console.log("get result!");
                    const response = await getIntermediateResults(localStorage.getItem("gameId"));
                    console.log(response);
                    let points1 = 0;
                    let points2 = 0;
                    for (let i = 0; i < response.data.length; i++) {
                        console.log(response.data[i].invitedPlayerResult);
                        points1 += response.data[i].invitedPlayerResult;
                        points2 += response.data[i].invitingPlayerResult;
                    }
                    let res = new Result(response.data[0]);
                    res.invitedPlayerResult = points1;
                    res.invitingPlayerResult = points2;
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

        console.log('selecting: ' + selecting + ', ' + (selecting == 'selecting'));
        if (selecting == 'selecting' && !topics) {
            fetchTopics();
        }
        fetchGame();
    }, [topics]);

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
            pathname: '/game/' + selecting,
            search: "?update=true",
            state: {
                question: question
            },
        });
    }

    const handleTimeOut = () => {
        if (selecting == 'selecting') {
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

    const handleQuestion = (msg) => {
        const question = new Question(JSON.parse(msg));
        toQuestion(question);
    }

    const drawTopics = () => {
        if (selecting == 'selecting' && topics) {
            return (
                <>
                    <div className="grid-2">
                        <div className="title grid2" style={{textAlign: "left"}}>
                            Select a topic
                        </div>
                        {topics.map((topic)=> (
                            <div key={topic} className={'topicSelection column-${index+1}'}>
                                <GameButton callback={() => fetchQuestion(topic)} text={parseString(topic)}/>
                            </div>
                        ))}
                    </div>
                </>
            );
        } else if (selecting == 'waiting') {
            return (
                <div className="background-topic-waiting">
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

    const drawTimer = () => {
        if (topics || localStorage.getItem('selecting') === 'false') {
            return (
                <Timer timeOut={handleTimeOut} timeLimit={15}/>
            );
        }
    }

    return (
        <>
            <GameHeader questionId={localStorage.getItem('question_nr')} height="100"/>
            <div className="ScreenGrid-Score">
                {drawResults()}
                {drawTopics()}
                {drawTimer()}
            </div>
        </>
    );
}

export default Score;
