import React from "react";
import PropTypes from "prop-types";
import "styles/views/HomeHeader.scss";
import {Link} from "react-router-dom";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const HomeHeader = props => (
    <header className="homeheader container">
            <Link className="logo fontbold" to="/home" style={{textAlign: "left"}}>
                BrainBusters
            </Link>
            <Link className="content fontbold" to="/ranking" style={{textAlign: "right"}}>
                RANKING
            </Link>
            <div className="content fontbold" to="/ranking" style={{textAlign: "right"}}>
                MUSIC
            </div>
            <Link className="content fontbold" to="/rules" style={{textAlign: "right"}}>
                RULES
            </Link>
            <div className="content fontbold" style={{textAlign: "right"}}>
                UserName
            </div>
    </header>
);

HomeHeader.propTypes = {
    height: PropTypes.string
};



/**
 * Don't forget to export your component!
 */
export default HomeHeader;
