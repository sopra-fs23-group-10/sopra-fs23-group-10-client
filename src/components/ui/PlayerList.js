import PropTypes from "prop-types";
import "styles/ui/PlayerList.scss";
import Player from "../ui/Player";
import {useEffect, useState} from 'react';
import { fetchOnlineUsers } from "helpers/restApi";
import { useHistory } from "react-router-dom";


export const PlayerList = props => {
    const history = useHistory;
    const [users, setUsers] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchOnlineUsers();
                setUsers(response.data);
                if (props.callback) props.callback(response.data);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    let userList = <div>waiting</div>;

    if (users) {
        userList = (
            <ul className="user-list">
                {users.map((user, index) => {
                    return user.id != localStorage.getItem('id') ?
                        <Player
                            user={user}
                            key={user.id}
                            action={props.action}
                            charNr={props.charNr}
                        />
                    :
                    <></>
                    })}
            </ul>
        );
    }

    return userList;
}

PlayerList.propTypes = {
    callback: PropTypes.func,
    action: PropTypes.func,
    charNr: PropTypes.number
};