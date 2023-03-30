import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

export const restApi = axios.create({
  baseURL: getDomain(),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
});

export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log('The request was made and answered but was unsuccessful.', error.response);
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert('The server cannot be reached.\nDid you start it?');
    }

    console.log('Something else happened.', error);
    return error.message;
  }
};

export const registerUser = async (username, password, email) => {
  try {

    const requestBody = JSON.stringify({ username, password, email });
    const response = await restApi.post('/users', requestBody);

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('id', response.data.id);

    // Wait for token and id to be set to avoid errors in /Home
    await Promise.all([
      localStorage.getItem('token'),
      localStorage.getItem('id')
    ]);

    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong during registration: \n${handleError(error)}`);
  }
};

export const updateUser = async (userId, username, birthdayDate) => {
  try {
    const authToken = localStorage.getItem('token');
    const requestBody = JSON.stringify({username, birthdayDate});
    await restApi.put(`/users/${userId}`, requestBody, {headers: {token: authToken}});
  } catch (error) {
    throw new Error(`Something went wrong during commitment of the changes: \n${handleError(error)}`);
  }
};


export const loginUser = async (username, password) => {
  try {
    const requestBody = JSON.stringify({username, password});
    const response = await restApi.post('/login', requestBody);

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('id', response.data.id);

    // Wait for token and id to be set to avoid errors in /Home
    await Promise.all([
      localStorage.getItem('token'),
      localStorage.getItem('id')
    ]);

    // Login successfully worked --> navigate to the route /home in the HomeRouter
  } catch (error) {
    alert(`Something went wrong during login: \n${handleError(error)}`);
  }
};

export const fetchUserData = async (userId) => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/users/${userId}`, {headers: {token: authToken}});

    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching the user data: \n${handleError(error)}`);
  }
};

export const fetchUserById = async (userId) => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/users/${userId}`, {headers: {token: authToken}});

    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching the user data: \n${handleError(error)}`);
  }
};

