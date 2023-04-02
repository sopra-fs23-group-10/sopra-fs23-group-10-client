import {useEffect, useState} from 'react';
import {fetchUsers, inviteUser, logoutUser} from 'helpers/restApi';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/views/GameHeader";
import "styles/views/Home.scss";
import "styles/views/GameHeader.scss"
import {connect} from "../../helpers/WebSocketFactory";
import Player from "components/ui/Player";
import Home from "./Home";

const GameScreen = () => {
    return (
        <>
            <GameHeader height="100"/>
        </>
    );
}

export default GameScreen;

