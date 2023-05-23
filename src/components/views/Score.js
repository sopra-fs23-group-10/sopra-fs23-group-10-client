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
import { Button } from "components/ui/Button";
import { ResultList } from "components/ui/ResultList";
import {cryptoRandom} from "../../helpers/utility";
import { FontResizer } from "components/ui/FontResizer";


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
                if (parseInt(localStorage.getItem('question_nr')) <= 0) {
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
                await getQuestion(localStorage.getItem('gameId'), topic);
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
            await getImageQuestion(localStorage.getItem('gameId'));
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    }

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const toQuestion = (question) => {
        console.log("TO QUESTION");
        console.log(question);
        localStorage.removeItem('topics');
        localStorage.removeItem('startTime');
        console.log(JSON.stringify(question));
        localStorage.setItem('question', JSON.stringify(question));
        let nr = parseInt(localStorage.getItem('question_nr'));
        localStorage.setItem('question_nr', (nr + 1));
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
        if (localStorage.getItem('topics') && !chosenTopic) {
            let newTopics = JSON.parse(localStorage.getItem('topics'));
            let rnd = cryptoRandom(3);
            console.log("RAND TOPIC -> " + rnd.toString());
            fetchQuestion(newTopics[rnd]).catch(error => {
                console.error(error);
            });
        }
    }

    const handleQuestion = (msg) => {
        const question = new Question(JSON.parse(msg));
        toQuestion(question);
    }

    const getQuestionSingle = () => {
        if (!buttonClicked) {
            setButtonClicked(true);
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
                                    {topics.map((topic, index)=> (
                                        <div key={topic} className={'topicSelection'}>
                                            <GameButton 
                                            callback={() => fetchQuestion(topic)} 
                                            disabled={buttonClicked} 
                                            inactive={buttonClicked}
                                            selected={chosenTopic == topic}
                                            text={parseString(topic)}
                                            delay={index/10}
                                            >
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
                        <div className="background-topic-waiting bounce-intro" style={{animationDelay:'0.15s'}}>
                            <div className="topic">
                                Your opponent is selecting a topic.
                            </div>
                        </div>
                    );
                }
            }
        } else {
            return (
                <div className="background-topic-waiting bounce-intro" style={{animationDelay:'0.1s'}}>
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
                        <FontResizer className="background-points bounce-intro" style={{animationDelay:'0.05s'}}>
                            <div className="player">
                                {usernameInviting}
                            </div>
                            <div className="points-score">
                                {result.invitingPlayerResult}
                            </div>
                        </FontResizer>
                        <FontResizer className="background-points bounce-intro" style={{animationDelay:'0.1s'}}>
                            <div className="player">
                                {usernameInvited}
                            </div>
                            <div className="points-score">
                                {result.invitedPlayerResult}
                            </div>
                        </FontResizer>
                    </div>
                )
            }
        } else if (result && usernameInviting){
            return(
                <FontResizer className="background-points bounce-intro" style={{animationDelay:'0.05s'}}>
                    <div className = "player" style={{textAlign: "center"}}>
                        {usernameInviting}
                    </div>
                    <div className = "points-score" style={{textAlign: "center"}}>
                        {result.invitingPlayerResult}
                    </div>
                </FontResizer>
            );
        }
    }

    const pastResults = (inviting) => {
        let playerResults = [];
        for (let r of results) {
            inviting ? playerResults.push(r.invitingPlayerResult) : playerResults.push(r.invitedPlayerResult)
        }
        return playerResults;
    }

    const drawResults = () => {
        if (playerMode == 'duel') {
            if (results && usernameInvited && usernameInviting) {
                return (
                    <div className="result-list-container grid grid-0 bounce-intro">
                        <ResultList style={{gridColumn:1}} results={pastResults(true)}/>
                        <ResultList style={{gridColumn:2}} results={pastResults(false)}/>
                    </div>
                );
            }
        } else if (result && usernameInviting){
            return(
                <div className="result-list-container grid-1 bounce-intro">
                    <ResultList results={pastResults(true)}/>
                </div>
            );
        }
    }


    const drawTimer = () => {
        if (playerMode == 'duel' || selecting != 'selecting') {
            let timeLimit = parseInt(localStorage.getItem("question_nr")) <= 0 ? 10 : 15;
            timeLimit = gameMode == 'image' ? 3 : timeLimit;
            return (
                <div className="font-white">
                    <Timer timeOut={handleTimeOut} timeLimit={timeLimit}/>
                </div>
            );
        }
    }

    const drawTitle = () => {
        if (parseInt(localStorage.getItem("question_nr")) <= 0) {
            return <div className="display" style={{fontSize:"100px", lineHeight:"50px"}}>Let's go!</div>
        }
    }

    return (
        <>
            <GameHeader playerMode={playerMode} gameMode={gameMode} questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            <div className="ScreenGrid-Score">
                {drawTitle()}
                {drawResults()}
                {drawTotalResult()}
                {drawTopics()}
                {drawTimer()}
            </div>
        </>
    );
}

export default Score;
