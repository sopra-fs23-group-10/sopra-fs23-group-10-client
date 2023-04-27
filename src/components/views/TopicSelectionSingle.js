import {
    handleError,
    getAllTopics
} from "helpers/restApi";
import React, {useEffect, useState, useRef} from 'react';
import { GameButton } from "components/ui/GameButton";
import 'styles/views/TopicSelectionSingle.scss';
import HomeHeader from "./HomeHeader";



const TopicSelectionSingle = props => {
    const [topics, setTopics] = useState(null);


    useEffect(() => {
        async function fetchTopics() {
            try {
                const response = await getAllTopics();
                setTopics(response.topics);
            } catch (error) {
                alert(`Something went wrong while fetching the topcis, ${handleError(error)}`);
            }
        }

        fetchTopics();

    }, [topics]);

    const parseString = (str) => {
        return str.replace('_', ' & ');
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
                        Select a topic <br />--> <strong> This feature will follow in the second sprint, buttons are not clickable</strong>
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
