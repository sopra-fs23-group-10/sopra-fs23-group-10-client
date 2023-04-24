import GameHeader from "components/views/GameHeader";
import {
    fetchUsersInGame,
    getTopicSelection,
    fetchUserById,
    getIntermediateResults,
    handleError,
    getQuestion,
    getAllTopics
} from "helpers/restApi";
import React, {useEffect, useState, useRef} from 'react';
import {useHistory, Prompt, useParams} from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import Result from "../../models/Result";
import 'styles/views/TopicSelectionSingle.scss';
import {connectQuestion} from "../../helpers/WebSocketFactory";
//import 'styles/views/Score.scss';
import {Timer} from "../ui/Timer";
import HomeHeader from "./HomeHeader";



const TopicSelectionSingle = props => {
    const history = useHistory();
    const [topics, setTopics] = useState(null);
    const topicsData = useRef(null);
    let { selecting } = useParams();

    useEffect(() => {
        //connectQuestion(handleQuestion);
        async function fetchTopics() {
            try {
                const response = await getAllTopics();
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }

        //console.log('selecting: ' + selecting + ', ' + (selecting == 'selecting'));
        //if (selecting == 'selecting' && !topics) {
        fetchTopics();
        //}
        //fetchGame();
    }, [topics]);

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }
    //const rndTopic = () => {
    //    let rnd = getRandomInt(0, 10);
    //    fetchQuestion(topics[rnd]);
    //}

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
                                    <GameButton text={parseString(topic)} />
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            );
        }
    }

    //const handleTimeOut = () => {
    //    if (localStorage.getItem('selecting') === "true") {
    //        rndTopic();
    //    }
    //}
    //const drawTimer = () => {
    //    if (topics || localStorage.getItem('selecting') === 'false') {
    //        return (
    //            <Timer timeOut={handleTimeOut} timeLimit={15}/>
    //        );
    //    }
    //}

    return (
        <>
            <HomeHeader height="100"/>
            <div className="ScreenGrid-SingTopicSelection">
                {TopicSel()}
            </div>
        </>
    );
}

export default TopicSelectionSingle;
