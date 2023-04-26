import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const GameGuard = props => {
    if (!localStorage.getItem("token")) {
        return <Redirect to="/login"/>;
    } else if (!localStorage.getItem("gameId")) {
        return <Redirect to="/home"/>;
    } else {
        return props.children;
    }
};

GameGuard.propTypes = {
  children: PropTypes.node
};