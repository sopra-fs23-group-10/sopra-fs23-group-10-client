import {useHistory} from 'react-router-dom';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import ReceiveInvitation from './ReceiveInvitation';
import {StarPlayerList} from "../ui/StarPlayerList";

const Ranking = props => {
    const history = useHistory();

    const getStarPlayers = (u) => {
        const sortedUsers = u.sort((a,b) => b.rank -a.rank);
        const topTenUsers = sortedUsers.reverse().slice(0,10);
        return topTenUsers;
    }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                        <strong> STAR PLAYERS </strong>
                </div>
                <StarPlayerList callback={getStarPlayers}/>
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
