import GameHeader from "components/views/GameHeader";
import { fetchUsersInGame, getTopicSelection, fetchUserById, getIntermediateResults, handleError, getQuestion, getImageQuestion } from "helpers/restApi";
import React, {useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import Result from "../../models/Result";
import {connectQuestion, disconnectQuestion} from "../../helpers/WebSocketFactory";
import 'styles/views/Score.scss';
import Question from "models/Question";
import {Timer} from "../ui/Timer";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { RoundResult } from "components/ui/RoundResult";
import { QuestionResult } from "components/ui/QuestionResult";
import { ResultList } from "components/ui/ResultList";
import {cryptoRandom} from "../../helpers/utility";


const Score = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [results, setResults] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const [topics, setTopics] = useState(null);
    const [chosenTopic, setChosenTopic] = useState(null);
    let { selecting, gameMode, playerMode } = useParams();
    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        connectQuestion(handleQuestion);

        async function fetchGame() {
            try {
                if (parseInt(localStorage.getItem('question_nr')) <= 1) {
                    const response = await fetchUsersInGame(localStorage.getItem("gameId"));
                    let res = new Result(response.data);
                    console.log(response);
                    setResult(res);
                    await getUser(response.data.invitedPlayerId, setUsernameInvited);
                    await getUser(response.data.invitingPlayerId, setUsernameInviting);
                } else {
                    const response = await getIntermediateResults(localStorage.getItem("gameId"));
                    setResults(response.data);
                    let points1 = 0;
                    let points2 = 0;
                    for (let r of response.data) {
                        points1 += r.invitedPlayerResult;
                        points2 += r.invitingPlayerResult;
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

        console.log("gamemode = " + gameMode);
        if (selecting == 'selecting' && !topics && playerMode == 'duel' && gameMode == "text") {
            if (!localStorage.getItem('topics')) {
                fetchTopics().catch(error => {
                    console.error(error);
                });
            } else {
                setTopics(JSON.parse(localStorage.getItem('topics')));
            }
        }

        if (!result) {
            fetchGame().catch(error => {
                console.error(error);
            });
        }
        return () => { disconnectQuestion(); }
    }, [topics]);

    async function fetchTopics() {
        try {
            const response = await getTopicSelection(localStorage.getItem("gameId"));
            setTopics(response.topics);
            localStorage.setItem('topics', JSON.stringify(response.topics));
        } catch (error) {
            alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
        }
    }

    const fetchQuestion = async (topic) => {
        if (!chosenTopic && !buttonClicked) {
            setButtonClicked(true);
            try {
                const response = await getQuestion(localStorage.getItem('gameId'), topic);
                if (playerMode == 'single' && response) toQuestion(response);
                setChosenTopic(topic);
            } catch (error) {
                alert(error);
                localStorage.removeItem('topics');
                history.push("/login");
            }
        }
    }

    const fetchImageQuestion = async () => {
        try {
            const response = await getImageQuestion(localStorage.getItem('gameId'));
            console.log(response);
            if (playerMode == 'single' && response) toQuestion(response);
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    }

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const toQuestion = (question) => {
        localStorage.removeItem('topics');
        localStorage.removeItem('startTime');
        localStorage.setItem('question', JSON.stringify(question));
        history.push('/game/' + playerMode + '/' + gameMode + "/" + selecting);
    }

    const handleTimeOut = () => {
        if (selecting == 'selecting') {
            if (gameMode == "text") {
                rndTopic();
            } else {
                fetchImageQuestion().catch(error => {
                    console.error(error);
                });
            }
        }
    }

    const rndTopic = () => {
        if (localStorage.getItem('topics')) {
            let newTopics = JSON.parse(localStorage.getItem('topics'));
            let rnd = cryptoRandom(3).catch(error => {
                console.error(error);
            });
            console.log("RAND TOPIC");
            fetchQuestion(newTopics[rnd]).catch(error => {
                console.error(error);
            });
        }
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

    const getQuestionSingle = () => {
        if (gameMode == "text") {
            fetchQuestion(localStorage.getItem('topic')).catch(error => {
                console.error(error);
            });
        } else {
            fetchImageQuestion().catch(error => {
                console.error(error);
            });
        }
    }

    const drawTopics = () => {
        if (playerMode == 'duel') {
            if (gameMode == 'text') {
                if (selecting == 'selecting') {
                    if (topics) {
                        return (
                            <>
                                <div className="grid-2">
                                    <div className="title grid2" style={{textAlign: "left"}}>
                                        Select a topic
                                    </div>
                                    {topics.map((topic)=> (
                                        <div key={topic} className={'topicSelection'}>
                                            <GameButton 
                                            callback={() => fetchQuestion(topic)} 
                                            disabled={buttonClicked && chosenTopic != topic} 
                                            selected={chosenTopic == topic}>
                                                {parseString(topic)}
                                            </GameButton>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    } else {
                        return (
                            <div className="background-topic-waiting">
                                <div className="topic">
                                    Waiting for topics...
                                </div>
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className="background-topic-waiting">
                            <div className="topic">
                                Your opponent is selecting a topic.
                            </div>
                        </div>
                    );
                }
            }
        } else {
            return (
                <div className="background-topic-waiting">
                    <div className="topic">
                        <div style={{ display: 'block' }}>
                            <p>Are you ready for the next question?</p>
                            <Button width="100%" onClick={() => getQuestionSingle()} disabled={buttonClicked}>Continue</Button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const drawTotalResult = () => {
        if (playerMode == 'duel'){
            if (result && usernameInvited && usernameInviting) {
                return (
                    <div className="grid grid-1">
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
                            <div className = "player" style={{textAlign: "center"}}>
                                {usernameInvited}
                            </div>
                            <div className = "points-score" style={{textAlign: "center"}}>
                                {result.invitedPlayerResult}
                            </div>
                        </div>
                    </div>
                )
            }
        } else if (result && usernameInviting){
            return(
                <div className="background-points" >
                    <div className = "player" style={{textAlign: "center"}}>
                        {usernameInviting}
                    </div>
                    <div className = "points-score" style={{textAlign: "center"}}>
                        {result.invitingPlayerResult}
                    </div>
                </div>
            );
        }
    }

    const pastResults = (inviting) => {
        if (results) {
            let playerResults = [];
            for (let r of results) {
                inviting ? playerResults.push(r.invitingPlayerResult) : playerResults.push(r.invitedPlayerResult)
            }
            return playerResults;
        }
    }

    const drawResults = () => {
        if (playerMode == 'duel') {
            if (results && usernameInvited && usernameInviting) {
                return (
                    <div className="result-list-container grid grid-0">
                        <ResultList style={{gridColumn:1}} results={pastResults(true)}/>
                        <ResultList style={{gridColumn:2}} results={pastResults(false)}/>
                    </div>
                );
            }
        } else if (result && usernameInviting){
            return(
                <div className="result-list-container grid-1 ">
                    <ResultList results={pastResults(true)}/>
                </div>
            );
        }
    }


    const drawTimer = () => {
        if (playerMode == 'duel' || selecting != 'selecting') {
            let timeLimit = parseInt(localStorage.getItem("question_nr")) <= 1 ? 10 : 15;
            return (
                <div className="font-white">
                    <Timer timeOut={handleTimeOut} timeLimit={timeLimit}/>
                </div>
            );
        }
    }

    const drawTitle = () => {
        if (parseInt(localStorage.getItem("question_nr")) <= 1) {
            return <div className="display">Get Ready!</div>
        }
    }

    return (
        <>
            <GameHeader playerMode={playerMode} questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            {drawTitle()}
            <div className="ScreenGrid-Score">
                {drawResults()}
                {drawTotalResult()}
                {drawTopics()}
                {drawTimer()}
            </div>
        </>
    );
}

export default Score;
