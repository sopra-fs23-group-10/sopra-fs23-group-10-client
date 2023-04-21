import {Stomp} from "@stomp/stompjs";
import axios from "axios";
import {getDomain} from "./getDomain";

const BASE_URL = getDomain();


function getWebSocketUrl() {
    const protocol = window.location.protocol;
    const domain = getDomain().split('//')[1];
    return `${protocol === "https:" ? "wss:" : "ws:"}//${domain}/ws`;
}

/*
function getWebSocketUrl() {
    const protocol = window.location.protocol;
    const domain = getDomain().split('//')[1];
    const ws = protocol === "https:" ? "wss:" : "ws:"
    return `${ws}//${domain}/${ws}`;
}
 */


export const socketFactory = () => {
    return new WebSocket(`${getWebSocketUrl()}`);}

const MAX_RETRIES = 10; // Maximum number of retries
let currentRetries = 0; // Current retry count
let listenersAdded = false; // Moved outside the connect function

const exponentialBackoff = (retries) => {
    return Math.min(30, (Math.pow(2, retries) - 1)) * 1000;
};

export const openSocket = () => {
    if (currentRetries >= MAX_RETRIES) {
        console.error('Max retries reached, connection aborted');
        return;
    }

    let stompClient = Stomp.over(function (){
        return new WebSocket(`${getWebSocketUrl()}`);
    });
    stompClient.debug = (message) => {
        console.log(message);
    };

    stompClient.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        currentRetries++;
        setTimeout(() => {
            openSocket();
        }, exponentialBackoff(currentRetries));
    };

    stompClient.onWebSocketClose = () => {
        console.error('WebSocket closed');
        currentRetries++;
        setTimeout(() => {
            openSocket();
        }, exponentialBackoff(currentRetries));
    };

    return stompClient;
}

export const register = () => {
    let stompClient = openSocket();

    stompClient.connect({'userId': localStorage.getItem('id')}, () => {
        currentRetries = 0; // Reset the retry count after successful connection

        if (!listenersAdded && localStorage.getItem('id')) {
            const socket = socketFactory();
            socket.onopen = () => {
                stompClient.send('/register', {}, localStorage.getItem('id'));
            };

            window.addEventListener('beforeunload', () => {
                stompClient.send('/unregister', {}, localStorage.getItem('id'));
                stompClient.disconnect();
            });

            listenersAdded = true;
        }
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.baseURL = BASE_URL;
}

export const connectInvitations = (inviteCallback, answerCallback) => {
    let stompClient = openSocket();

    const id = localStorage.getItem('id');

    stompClient.connect({'userId': localStorage.getItem('id')}, () => {
        currentRetries = 0; // Reset the retry count after successful connection
        
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

export const connectQuestion = (questionCallback) => {
    let stompClient = openSocket();

    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        currentRetries = 0; // Reset the retry count after successful connection
        
        stompClient.subscribe(`/games/${id}/questions`, (message) => {
            questionCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};

export const connectGame = (gameCallback) => {
    let stompClient = openSocket();

    const id = localStorage.getItem('gameId');

    stompClient.connect({'gameId': localStorage.getItem('gameId')}, () => {
        currentRetries = 0; // Reset the retry count after successful connection
        
        stompClient.subscribe(`/games/${id}`, (message) => {
            gameCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });
    });
};
