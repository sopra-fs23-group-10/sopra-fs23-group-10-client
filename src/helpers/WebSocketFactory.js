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

export const connect = () => {
    const id = localStorage.getItem('id');
    const stompClient = Stomp.over(function (){
        return new WebSocket(`${getWebSocketUrl()}`)
    });
    stompClient.debug = (message) => {
        console.log(message);
    };

    stompClient.reconnect_delay = 5000;
    stompClient.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        setTimeout(() => {
            connect();
        }, stompClient.reconnect_delay);
    };

    stompClient.onWebSocketClose = () => {
        console.error('WebSocket closed');
        setTimeout(() => {
            connect();
        }, stompClient.reconnect_delay);
    };

    stompClient.connect({'userId': localStorage.getItem('id')}, () => {
        stompClient.subscribe(`/invitations/${id}`, (message) => {
            console.log(`Received message: ${message.body}`);
            alert("Server says: " + message.body);
        });

        const socket = socketFactory();
        socket.onopen = () => {
            stompClient.send('/register', {}, localStorage.getItem('id'));
        };
    });

    window.addEventListener('beforeunload', () => {
        stompClient.send('/unregister', {}, localStorage.getItem('id'));
        stompClient.disconnect();
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.baseURL = BASE_URL;
};