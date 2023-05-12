import PropTypes from "prop-types";
import "styles/ui/PlayerList.scss";
import StarPlayer from "../ui/StarPlayer";
import {useEffect, useState} from 'react';
import { fetchOnlineUsers } from "helpers/restApi";
import { useHistory } from "react-router-dom";


export const StarPlayerList = props => {
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
        fetchData();
    }, []);

    let userList = <div>waiting</div>;

    if (users) {
        userList = (
            <ul className="user-list">
                {users.map(user => {
                    return user.id != localStorage.getItem('id') ?
                        <StarPlayer
                            user={user}
                            key={user.id}
                            action={props.action}
                        />
                        :
                        <></>
                })}
            </ul>
        );
    }

    return userList;
}

StarPlayerList.propTypes = {
    callback: PropTypes.func,
    action: PropTypes.func
};