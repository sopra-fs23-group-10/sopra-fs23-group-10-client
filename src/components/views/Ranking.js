import React,{useEffect,useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import ReceiveInvitation from './ReceiveInvitation';
import {StarPlayerList} from "../ui/StarPlayerList";
import {fetchUserById} from "../../helpers/restApi";
import User from "../../models/User";


const Ranking = props => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [username, setUsername] = useState(null);
    const [points, setPoints] = useState(null);
    const [rank, setRank] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(localStorage.getItem('id'));
                const user = new User(userData);
                setUsername(user.username);
                setPoints(user.points);
                setRank(user.rank);

            } catch (error) {
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    const getStarPlayers = (u) => {
        const sortedUsers = u.sort((a,b) => b.rank -a.rank);
        const topTenUsers = sortedUsers.slice(0,10);
        return topTenUsers;
    }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                        <strong> STAR PLAYERS </strong> <br />
                        <br />
                    </p>
                </div>
                <div className ="content_location">
                <StarPlayerList callback={getStarPlayers}/>
                </div>
                <div className="button-container">
                    <Button
                        width="100%"
                        onClick={() => history.push('/home')}
                    >
                        BACK
                    </Button>
                </div>

            </BaseContainer>
        </>
    );
};


export default Ranking;
