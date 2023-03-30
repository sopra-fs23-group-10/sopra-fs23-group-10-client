import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


const BASE_URL = 'http://localhost:8080';

const connect = () => {
    const socket = new SockJS(`${BASE_URL}/ws`);

    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
        stompClient.subscribe('/topic/questions', (message) => {
            console.log(`Received message: ${message.body}`);
            // Do something with the message
        });
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.baseURL = BASE_URL;
};

export default {
    connect
};
