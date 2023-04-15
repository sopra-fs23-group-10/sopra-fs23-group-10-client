import GameHeader from "components/views/GameHeader";
import "styles/views/TopicSelection.scss"
import { getTopicSelection } from "helpers/restApi";
import BaseContainer from "components/ui/BaseContainer";
import {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";

const TopicSelection = () => {
    const history = useHistory();
    const [topics, setTopics] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.data);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    const topicItems = topics.map((topic) => 
        // <div onClick={() => history.push('/game', {topic: topic})}>
        <div>
            <BaseContainer>
                {topic}
            </BaseContainer>
        </div>
    );

    const drawTopics = () => {
        if (topics) {
            return (
                {topicItems}
            );
        }
    }

    return (
        <>
            <GameHeader height="100"/>
        </>
    );
}

export default TopicSelection;
