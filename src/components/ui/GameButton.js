import "styles/ui/GameButton.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";
import check from "images/checkmark--filled.svg";

export const GameButton = props => {
  const selectedIcon = () => {
    if (props.selected) {
      return (
        <img className='game-button selected-icon' src={check}></img>
      );
    }
  }

  return (
    <div className={`game-button container ${props.disabled ? 'disabled' : ''}`}>
      <BaseContainer className={`game-button topicContent ${props.selected ? 'selected' : ''} ${props.className}`} onClick={() => props.callback()} style={{textAlign:"center"}}>
        {props.children}
      </BaseContainer>
      {selectedIcon()}
    </div>
  );
}

GameButton.propTypes = {
  text: PropTypes.string,
  callback: PropTypes.func,
  className: PropTypes.string,
  selected: PropTypes.bool,
  disabled: PropTypes.bool
};