import React from "react";
import PropTypes from "prop-types";
import {Button} from 'components/ui/Button';
import {logoutUser} from 'helpers/restApi';
import {useHistory} from 'react-router-dom';
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
const logout = async () => {
    const response = await logoutUser(useHistory);
}

const HomeHeader = props => (
    <header className="homeheader container">
            <Link className="logo fontbold" to="/home">
                BrainBusters
            </Link>
            <div className="navigation">
                <Link className="content fontbold" to="/ranking">
                    RANKING
                </Link>
                <div className="content fontbold" to="/ranking">
                    MUSIC
                </div>
                <Link className="content fontbold" to="/rules">
                    RULES
                </Link>
            </div>
            <div className="content fontbold profile">
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
