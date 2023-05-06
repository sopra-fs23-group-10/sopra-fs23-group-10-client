import "styles/ui/RoundResult.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";
import x from "images/close.svg";
import check from "images/checkmark.svg";

export const RoundResult = props => (
  <BaseContainer className={`round-result container ${props.className}`}>
    <div className="index">{props.index}</div>
    <div className="points">points: {props.points}</div>
    <img className="icon" src={props.points != 0 ? check : x}></img>
  </BaseContainer>
);

RoundResult.propTypes = {
    index: PropTypes.number,
    points: PropTypes.number
};