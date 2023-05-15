import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const LoginGuard = props => {
  const stopMusic = () => {
    const event = new CustomEvent('playingChange', { detail: false });
    document.dispatchEvent(event);
}
  if (!localStorage.getItem("token")) {
    stopMusic();
    return props.children;
  }
  return <Redirect to="/home"/>;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}