import "styles/ui/GameButton.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";

export const GameButton = props => (
  <BaseContainer onClick={() => props.callback()} className="game-button topicContent" style={{textAlign:"center"}}>
    {props.text}
  </BaseContainer>
);

GameButton.propTypes = {
  text: PropTypes.string,
  callback: PropTypes.func
};