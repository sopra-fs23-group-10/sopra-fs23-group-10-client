import PropTypes from "prop-types";
import {Button} from 'components/ui/Button';
import {fetchUserById, logoutUser} from 'helpers/restApi';
import {useHistory} from 'react-router-dom';
import "styles/views/HomeHeader.scss";
import {Link} from "react-router-dom";
import React,{useEffect,useState} from 'react';
import User from "../../models/User";
import "styles/views/PopUp.scss";
import ReceiveInvitation from "components/views/ReceiveInvitation";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const HomeHeader = props => {

    const history = useHistory();
    //const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [status, setStatus] = useState(null);
    const [points, setPoints] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(localStorage.getItem('id'));

                const user = new User(userData);

                setUsername(user.username);
                setStatus(user.status);
                setPoints(user.points);
                //setProfilePicture(user.profilePicture);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    const logout = async () => {
        const response = await logoutUser(useHistory);
        history.push('/login');
    }

    const edit = () => {
        return <Link className="contentHover"
            onClick={() => toEdit(localStorage.getItem('id'))}>
            Edit Profile
        </Link>
    }

    const toEdit = (userId) => {
        history.push('edit/'+userId)
    }
    const [showProfile, setDropDown] = useState(false);
    const dropDown = () =>{
        if(showProfile){
            return(
                <div className="dropdown container">
                    <div className="contentNoHover" style={{textAlign: "left"}}>
                        Points: {points}
                    </div>
                    <div className="contentHover" style={{textAlign: "right"}}>
                        {edit()}
                    </div>
                    <Button className ="logout"
                        width="100%"
                        onClick={() => logout()}
                    >
                        LOGOUT
                    </Button>
                </div>
            )
        }
    }

    return (
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
            <a className="content fontbold profile"
                onClick = {() => {setDropDown(!showProfile)}}>
                {username}
                {dropDown()}
            </a>
        </header>
    );
};

HomeHeader.propTypes = {
    height: PropTypes.string
};



/**
 * Don't forget to export your component!
 */
export default HomeHeader;
