import GameHeader from "components/views/GameHeader";
import { fetchUsersInGame, getTopicSelection, fetchUserById, getIntermediateResults, handleError, getQuestion } from "helpers/restApi";
import React, {useEffect, useState, useRef} from 'react';
import { useHistory, Prompt } from "react-router-dom";
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

    useEffect(() => {
        //connectQuestion(handleQuestion);
        async function fetchTopics() {
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }

        if (localStorage.getItem('selecting') === "true" && !topics) {
            fetchTopics();
        }
        //fetchGame();
    }, [topics]);

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }
    //const rndTopic = () => {
    //    let rnd = getRandomInt(0, 10);
    //    fetchQuestion(topics[rnd]);
    //}

    const drawTopic = () => {
        if ((localStorage.getItem('selecting') == "true") && topics) {
            return (
                <>
                    <div className="title spread" style={{textAlign: "left"}}>
                        Select a topic
                    </div>
                    {topics.map((topic) => (
                        <div key={topic} className={'topicSelection column-${index+1}'}>
                            <GameButton text={parseString(topic)}/>
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
                    {drawTopic()}
                </div>
            </>
        );
}

export default TopicSelectionSingle;
