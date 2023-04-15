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

export const connect = (inviteCallback, answerCallback) => {
    if (currentRetries >= MAX_RETRIES) {
        console.error('Max retries reached, connection aborted');
        return;
    }

    const id = localStorage.getItem('id');
    const stompClient = Stomp.over(function (){
        return new WebSocket(`${getWebSocketUrl()}`);
    });
    stompClient.debug = (message) => {
        console.log(message);
    };

    stompClient.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        currentRetries++;
        setTimeout(() => {
            connect(inviteCallback);
        }, exponentialBackoff(currentRetries));
    };

    stompClient.onWebSocketClose = () => {
        console.error('WebSocket closed');
        currentRetries++;
        setTimeout(() => {
            connect(inviteCallback);
        }, exponentialBackoff(currentRetries));
    };

    stompClient.connect({'userId': localStorage.getItem('id')}, () => {
        currentRetries = 0; // Reset the retry count after successful connection
        
        stompClient.subscribe(`/invitation/${id}`, (message) => {
            inviteCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });

        stompClient.subscribe(`/invitation/answer/${id}`, (message) => {
            answerCallback(message.body);
            console.log(`Received message: ${message.body}`);
        });

        if (!listenersAdded) {
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
};