import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import axios from "axios";

const BASE_URL = 'http://localhost:8080';

export const socketFactory = () => new SockJS(`${BASE_URL}/ws`);

export const connect = () => {
    const id = localStorage.getItem('id');
    const stompClient = Stomp.over(socketFactory());
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

    stompClient.connect({}, () => {
        stompClient.subscribe(`/invitations/${id}`, (message) => {
            console.log(`Received message: ${message.body}`);
            alert("Server says: " + message.body);
        });
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.baseURL = BASE_URL;
};

