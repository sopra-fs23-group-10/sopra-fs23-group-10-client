import "styles/ui/RoundResult.scss";
import PropTypes from "prop-types";
import x from "images/close.svg";
import check from "images/checkmark.svg";

export const QuestionResult = props => (
    <div className={`question-box ${!props.answered ? "disabled" : ""}`}>
        <img className='icon' src={props.points != 0 ? check : x}></img>
    </div>
);

QuestionResult.propTypes = {
    points: PropTypes.number,
    answered: PropTypes.bool
};