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
                console.log(response);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    const drawTopics = () => {
        if (topics) {
            let topicItems = topics.map((topic) => 
                <div onClick={() => history.push('/game', {topic: topic})}>
                    <BaseContainer>
                        {topic}
                    </BaseContainer>
                </div>
            );

            return (
                {topicItems}
            );
        }
    }

    return (
        <>
            <GameHeader height="100"/>
            {drawTopics()}
        </>
    );
}

export default TopicSelection;
