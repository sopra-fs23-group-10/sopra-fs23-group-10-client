import PropTypes from "prop-types";
import {Button} from 'components/ui/Button';
import {fetchUserById, logoutUser} from 'helpers/restApi';
import {Link, useHistory} from 'react-router-dom';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import User from "../../models/User";
import "styles/views/PopUp.scss";
import Triangle from "images/Triangle.png";
import arrow from "images/arrow.png";
import Identicon from 'react-identicons';


const HomeHeader = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [points, setPoints] = useState(null);
    const [rank, setRank] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(localStorage.getItem('id'));

                const user = new User(userData);

                setUsername(user.username);
                setPoints(user.points);
                setProfilePicture(user.profilePicture);
                setRank(user.rank);

            } catch (error) {
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    const logout = async () => {
        await logoutUser(useHistory);
        history.push('/login');
    }

    const edit = () => {
        return <Link className="contentHover "
                  onClick ={() => toEdit(localStorage.getItem('id'))}>
                Edit Profile
                <img className='arrow' src={arrow} style={{position: "absolute", right: "10px", top: "28%", transform: "translateY(-50%)"}}></img>
            </Link>
    }

    const toEdit = (userId) => {
        history.push("/users/" +userId)
    }
    const [showProfile, setDropDown] = useState(false);
    const dropDown = () =>{
        if(showProfile){
            return(
                <>
                    <div onClick={() => {setDropDown(false)}} className="profile-background"></div>
                    <div className="wrapper">
                        <img className='Triangle' src={Triangle}></img>
                        <div className="dropdown container">
                            <div className="contentNoHover" style={{textAlign: "left"}}>
                                <p>
                                    Points: {points} <br/>
                                <span style={{fontSize: "medium"}}>#{rank}</span>
                                </p>
                            </div>
                            <div className="contentHover" style={{textAlign: "right"}}>
                                {edit()}
                                <p>

                                </p>
                            </div>
                            <Button className ="logout"
                                    width="100%"
                                    onClick={() => logout()}
                            >
                                LOGOUT
                            </Button>
                        </div>
                    </div>
                </>
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
                <div className="content fontbold disabled">
                    MUSIC
                </div>
                <Link className="content fontbold" to="/rules">
                    RULES
                </Link>
            </div>
            <div className="profile-container">
                <a className="content fontbold profile"
                    onClick = {() => {setDropDown(!showProfile)}}>
                    <p className="username">{username}</p>
                    <Identicon className="profile-picture" string={profilePicture}/>
                </a>
            </div>
            {dropDown()}
        </header>
    );
};

HomeHeader.propTypes = {
    height: PropTypes.string
};

export default HomeHeader;
