import "styles/ui/GameButton.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";

export const GameButton = props => (
  <BaseContainer className={`game-button topicContent ${props.className}`} onClick={() => props.callback()} style={{textAlign:"center"}}>
    {props.children}
  </BaseContainer>
);

GameButton.propTypes = {
  text: PropTypes.string,
  callback: PropTypes.func,
  className: PropTypes.string
};