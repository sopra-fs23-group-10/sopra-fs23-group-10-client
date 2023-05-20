import {
    handleError,
    getAllTopics,
    getQuestion,
    createGame
} from "helpers/restApi";
import React, {useEffect, useState } from 'react';
import { GameButton } from "components/ui/GameButton";
import 'styles/views/TopicSelectionSingle.scss';
import { useHistory, useParams } from "react-router-dom";
import GameHeader from "./GameHeader";



const TopicSelectionSingle = props => {
    const [topics, setTopics] = useState(null);
    const history = useHistory();
    const { gameMode } = useParams();
    const [topicSent, setTopicSent] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    localStorage.setItem('question_nr', 0);

    useEffect(() => {
        async function newGame() {
            try {
                console.log("new game");
                const response = await createGame(0, gameMode.toUpperCase(), 'SINGLE');
                console.log(response);
                localStorage.setItem('gameId', response.gameId);
            } catch (error) {
                alert(`Something went wrong while creating a new game, ${handleError(error)}`);
            }
        }

        async function fetchTopics() {
            try {
                const response = await getAllTopics();
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }
        fetchTopics().catch(error => {
            console.error(error);
        });
        if (!localStorage.getItem('gameId')) {
            newGame().catch(error => {
                console.error(error);
            });
        }

    }, [topics]);

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const fetchQuestion = async (topic) => {
        if (!topicSent && !buttonClicked) {
            setButtonClicked(true);
            try {
                localStorage.setItem('topic', topic);
                const response = await getQuestion(localStorage.getItem('gameId'), topic);
                setTopicSent(true);
                toQuestion(response);
            } catch (error) {
                alert(error);
                localStorage.removeItem('topics');
                history.push("/login");
            }
        }
    }

    const toQuestion = (question) => {
        localStorage.removeItem('topics');
        localStorage.removeItem('startTime');
        localStorage.setItem('question', JSON.stringify(question));
        let nr = parseInt(localStorage.getItem('question_nr'));
        localStorage.setItem('question_nr', (nr + 1));
        history.push('/game/single/' + gameMode + "/selecting");
    }

    const TopicSel = () => {
        if (topics) {
            const rows = Math.ceil(topics.length / 3);
            const topicRows = Array.from({ length: rows }, (_, index) => {
                const start = index * 3;
                const end = start + 3;
                return topics.slice(start, end);
            });
            return (
                <>
                    <div className="title spread" style={{ textAlign: "left" }}>
                        Select a topic
                    </div>
                    {topicRows.map((row, index) => (
                        <div className="topic-row" key={index} style={{ marginBottom: "20px" }}>
                            {row.map((topic) => (
                                <div className="topicSelection" key={topic}>
                                    <GameButton 
                                    callback={() => fetchQuestion(topic).catch(error => {
                                        console.error(error);
                                    })} 
                                    disabled={buttonClicked} 
                                    inactive={buttonClicked}
                                    selected={localStorage.getItem("topic") == topic}
                                    text={parseString(topic)}
                                    ></GameButton>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            );
        }
    }

    const drawHeader = () => {
        if (localStorage.getItem('gameId')){
            return (
                <GameHeader showCancelButton={true} gameMode={gameMode} questionId={localStorage.getItem('question_nr')} playerMode="single" height="100"/>
            );
        }
    }

    return (
        <>
            {drawHeader()}
            <div className="ScreenGrid-SingTopicSelection">
                {TopicSel()}
            </div>
        </>
    );
}

export default TopicSelectionSingle;
