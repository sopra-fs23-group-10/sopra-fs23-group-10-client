import PropTypes from "prop-types";
import {Button} from 'components/ui/Button';
import {fetchUserById, logoutUser} from 'helpers/restApi';
import {Link, useHistory} from 'react-router-dom';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import User from "../../models/User";
import "styles/views/PopUp.scss";
import arrow from "images/arrow.png";
import Identicon from 'react-identicons';
import DropDown from "components/ui/DropDown";
import 'rc-slider/assets/index.css';
import MusicInterface from "components/ui/MusicInterface";
import Music from "images/Music.png";
import result from "images/result.svg";
import trophy from "images/trophy.svg";


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
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    const logout = async () => {
        const event = new CustomEvent('playingChange', { detail: false });
        document.dispatchEvent(event);
        await logoutUser(useHistory);
        history.push('/login');
    }

    const edit = () => {
        return (
            <>
                <div className="contentHover" style={{ position: 'relative'}}>
                    <div className="editProfile" style={{ position: 'absolute', top: '0', left: '0' }}
                        onClick={() => toEdit(localStorage.getItem('id'))}
                    >
                    Edit Profile
                    <img className='arrow' src={arrow} style={{position: "absolute", right: "-20px", top: "58%", transform: "translateY(-50%)"}}></img>
                    </div>
                </div>
            </>
            )
    }

    const toEdit = (userId) => {
        history.push("/users/" +userId)
    }

    const shortenName = (name, n) => {
        return (name.length > n) ? name.slice(0, n-1) + '...' : name;
    }

    const [showProfile, setShowProfile] = useState(false);
    const [showMusic, setShowMusic] = useState(false);

    return (
        <header className="homeheader container">
            <Link className="logo" to="/home">
                BrainBusters
            </Link>
            <div className="navigation">
                <div className="content nav-item" onClick={() => history.push("/ranking")}>
                    <img className='icons' src={trophy} style={{right: "65px", top: "52%"}}></img>
                    Ranking
                </div>
                <div className="content" >
                    <div className="nav-item" style={{height:"100%"}} onClick={() => setShowMusic(!showMusic)}>
                        <img className='icons' src={Music} style={{right: "50px", top: "52%"}}></img>
                        Music
                    </div>
                    <DropDown centered={true} yOffset={100} show={showMusic} setShow={setShowMusic}>
                        <MusicInterface/>
                    </DropDown>
                </div>
                <div className="content nav-item" onClick={() => history.push("/rules")}>
                    <img className='icons' src={result} style={{right: "45px", top: "51%"}}></img>
                    Rules
                </div>
            </div>
            <div className="profile-container">
                <a className="content fontbold profile nav-item"
                    onClick = {() => {setShowProfile(!showProfile)}}>
                    <p className="username">{username ? shortenName(username, 12) : ""}</p>
                    <Identicon className="profile-picture" string={profilePicture} size={40}/>
                </a>
                <DropDown yOffset={83} show={showProfile} setShow={setShowProfile}>
                    <div className="dropdown container">
                        <div className="contentNoHover" style={{textAlign: "left"}}>
                        <p>
                            Points: {points} <br/>
                        <span style={{fontSize: "medium", color: "gray"}  }>#{rank}</span>
                        </p>
                        </div>
                        <div className="contentHover" style={{textAlign: "right"}}>
                        <p>
                            {edit()}
                            <div style={{height: "46px"}}> </div>
                        </p>
                        </div>
                        <Button className ="logout"
                                width="100%"
                                onClick={() => logout()}
                        >
                            LOGOUT
                        </Button>
                    </div>
                </DropDown>
            </div>
        </header>
    );
};

HomeHeader.propTypes = {
    height: PropTypes.string
};

export default HomeHeader;
