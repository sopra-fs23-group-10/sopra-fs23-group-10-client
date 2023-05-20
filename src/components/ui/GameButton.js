import "styles/ui/GameButton.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";
import check from "images/checkmark--filled.svg";
import { useState, useEffect, useRef } from "react";

export const GameButton = props => {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
      function handleWindowResize() {
        setWidth(ref.current.clientWidth);
      }
  
      window.addEventListener('resize', handleWindowResize);
      setWidth(ref.current.clientWidth);
  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);

  const selectedIcon = () => {
    if (props.selected) {
      return (
        <img className='game-button selected-icon' src={check}></img>
      );
    }
  }

  const resizeText = (text) => {
    if (text.length > 80 && width < 250) return "font-small"
    else if (text.length > 80 || width < 250) return "font-medium"
    else return '';
  }

  return (
    <div ref={ref} className={`game-button container ${props.disabled ? 'disabled' : ''} ${props.inactive ? 'inactive' : ''}`}>
      <BaseContainer className={`game-button topicContent 
                                ${props.selected ? 'selected' : ''} 
                                ${resizeText(props.text)} 
                                ${props.className ? props.className : ''}`
                              } 
                     onClick={() => props.callback()} 
                     style={{textAlign:"center"}}>
        {props.text}
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
  disabled: PropTypes.bool,
  inactive: PropTypes.bool
};