import {Stomp} from "@stomp/stompjs";
import axios from "axios";
import {getDomain} from "./getDomain";

const BASE_URL = getDomain();

function getWebSocketUrl() {
    const protocol = window.location.protocol;
    const domain = getDomain().split('//')[1];
    return `${protocol === "https:" ? "wss:" : "ws:"}//${domain}/ws`;
}

export const socketFactory = () => {
    return new WebSocket(`${getWebSocketUrl()}`);}

let listenersAdded = false;

export const openSocket = () => {

    let stompClient = Stomp.over(function (){
        return new WebSocket(`${getWebSocketUrl()}`);
    });

    stompClient.debug = (message) => {
        if (!message.includes("PING") &&
          !message.includes("PONG") &&
          !message.includes("Received")) {
            console.log(message);
        }
    };

    stompClient.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        setTimeout(() => {
            openSocket();
        });
    };

    stompClient.onWebSocketClose = () => {
        console.log('One of the WebSockets has closed');
        setTimeout(() => {
            openSocket();
        });
    };
    return stompClient;
}

export const register = () => {
    let stompClient = openSocket();
    stompClient.connect({'userId': localStorage.getItem('id')}, () => {});

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.baseURL = BASE_URL;
}

let stompClientInvitations;

export const connectInvitations = (inviteCallback, answerCallback) => {
    let stompClient = openSocket();
    stompClientInvitations = stompClient;
    const id = localStorage.getItem('id');

    stompClient.connect({'userId': localStorage.getItem('id')}, () => {
        stompClient.subscribe(`/invitations/${id}`, (message) => {
            inviteCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });

        stompClient.subscribe(`/invitations/answer/${id}`, (message) => {
            answerCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};

export const disconnectInvitations = () => {
    stompClientInvitations.disconnect(() => {console.log("disconnected invitations!")});
};

let stompClientQuestion;

export const connectQuestion = (questionCallback) => {
    let stompClient = openSocket();
    stompClientQuestion = stompClient;

    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        stompClient.subscribe(`/games/${id}/questions`, (message) => {
            questionCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};

export const disconnectQuestion = () => {
    stompClientQuestion.disconnect(() => {console.log("disconnected question!")});
};


let stompClientGame;

export const connectGame = (gameCallback) => {
    let stompClient = openSocket();
    stompClientGame = stompClient;
    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        stompClient.subscribe(`/games/${id}`, (message) => {
            gameCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};

export const disconnectGame = () => {
    stompClientGame.disconnect(() => {console.log("disconnected game")});
};


let stompClientRound;

export const connectRound = (roundCallback) => {
    let stompClient = openSocket();
    stompClientRound = stompClient;
    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        stompClient.subscribe(`/games/${id}/round`, (message) => {
            roundCallback(message.body);
            console.log(`Round ended: Received message: ${message.body}`);
        });
    });
};

export const disconnectRound = () => {
    stompClientRound.disconnect(() => {console.log("disconnected round")});
};

let stompClientResult;

export const connectResult = (resultCallback) => {
    let stompClient = openSocket();
    stompClientResult = stompClient;
    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        stompClient.subscribe(`/game/result/${id}`, (message) => {
            resultCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};

export const disconnectResult = () => {
    stompClientResult.disconnect(() => {console.log("disconnected result")});
};
