import "styles/ui/RoundResult.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";
import { QuestionResult } from "./QuestionResult";

export const ResultList = props => {
    const fillRest = () => {
        let n = parseInt(localStorage.getItem('total_questions'));
        let content = []
        for (let i = props.results.length; i < n; i++) {
            content.push(<QuestionResult answered={false} key={i} points={0}></QuestionResult>);
        }
        return content;
    }

    return (
        <BaseContainer className="question-result-container">
            {props.results.map((result, index) => {
                return (
                    <QuestionResult answered={true} key={index} points={result}></QuestionResult>
                );
            })}
            {fillRest()}
        </BaseContainer>
    );
}

ResultList.propTypes = {
    results: PropTypes.array
};