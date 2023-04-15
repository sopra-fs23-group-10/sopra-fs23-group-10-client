import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const GameGuard = props => {
    console.log("gameId:" + localStorage.getItem("gameId"));
    if (!localStorage.getItem("token")) {
        return <Redirect to="/login"/>;
    } else if (localStorage.getItem("gameId")) {
        return props.children;
    } else {
        return <Redirect to="/home"/>;
    }
};

GameGuard.propTypes = {
  children: PropTypes.node
};