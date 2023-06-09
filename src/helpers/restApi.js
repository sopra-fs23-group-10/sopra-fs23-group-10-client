import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

export const restApi = axios.create({
  baseURL: getDomain(),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': /^(https?:\/\/(?:sopra-fs23-group-10-server\.oa\.r\.appspot\.com|localhost:8080))$/,
  },
});

export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  const statusCodeRegex = /^[4|5]\d{2}$/;
  if (response && statusCodeRegex.exec(`${response.status}`)) {
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
};

export const updateUser = async (userId, username, profilePicture) => {
  try {
    const authToken = localStorage.getItem('token');
    const requestBody = JSON.stringify({username, profilePicture});
    await restApi.put(`/users/${userId}`, requestBody, {headers: {token: authToken}});
  } catch (error) {
    throw new Error(`Something went wrong during commitment of the changes: \n${handleError(error)}`);
  }
};

export const loginUser = async (username, password) => {
  const requestBody = JSON.stringify({username, password});
  const response = await restApi.post('/login', requestBody);

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('id', response.data.id);

  // Wait for token and id to be set to avoid errors in /Home
  await Promise.all([
    localStorage.getItem('token'),
    localStorage.getItem('id')
  ]);
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

export const logoutUser = async (history) => {
  try {
    const userId = localStorage.getItem('id');
    const requestBody = JSON.stringify({userId});
    const response = await restApi.post(`/logout/${userId}`, requestBody, {headers: {token: localStorage.getItem('token')}});
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    return response.data;
  } catch (error) {

    localStorage.removeItem('token');
    localStorage.removeItem('id');
    throw new Error(`Something went wrong while fetching the user data: \n${handleError(error)}`);
  }
};

export const fetchUsers = async () => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await restApi.get('/users', {headers: {token: authToken}});
    return response;
  } catch (error) {
    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while fetching the users! See the console for details.");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  }
};

export const fetchUsersInGame = async () => {
  try {
    const authToken = localStorage.getItem('token');
    const id = localStorage.getItem('gameId');
    const response = await restApi.get(`/games/${id}/users`, {headers: {token: authToken}});
    return response;
  } catch (error) {
    alert(error);
  }
}

export const fetchOnlineUsers = async () => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await restApi.get('/users/online', {headers: {token: authToken}});
    return response;
  } catch (error) {
    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while fetching the users! See the console for details.");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  }
};

export const createGame = async (invitedUserId, quizType, modeType) => {
  console.log("create game quizType: " + quizType);
  const invitingUserId = localStorage.getItem('id');
  const authToken = localStorage.getItem('token');
  const requestBody = JSON.stringify({invitingUserId, invitedUserId, quizType, modeType});
  const response = await restApi.post('/games', requestBody, {headers: {token: authToken}});
  return response.data;
};

export const answerInvite = async (gameId, answer) => {
  try {
    const authToken = localStorage.getItem('token');
    const requestBody = JSON.stringify(answer);
    const response = await restApi.post(`/games/${gameId}/invitation`, requestBody, {headers: {token: authToken}});
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong during invite response: \n${handleError(error)}`);
  }
};

export const getTopicSelection = async (gameId) => {
  try{
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/games/${gameId}/topics`, {headers: {token: authToken}})
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching a selection of topics: \n${handleError(error)}`);
  }
}

export const getAllTopics = async () => {
  try{
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/games/topics/all`, {headers: {token: authToken}})
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching a selection of topics: \n${handleError(error)}`);
  }
}

export const getQuestion = async (gameId, topic) => {
  try {
    const authToken = localStorage.getItem('token');
    const requestBody = JSON.stringify({gameId: gameId, category: topic});
    const response = await restApi.post("/games/topics", requestBody, {headers: {token: authToken}})
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching a question: \n${handleError(error)}`);
  }
}

export const getImageQuestion = async (gameId) => {
  console.log("get image question gameId: " + gameId);
  try {
    const authToken = localStorage.getItem('token');
    const requestBody = JSON.stringify({gameId: gameId});
    const response = await restApi.post("/games/images", requestBody, {headers: {token: authToken}})
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while fetching a question: \n${handleError(error)}`);
  }
}

export const sendAnswer = async (gameId, userId, questionId, answerString, answeredTime) => {
  try {
    const requestBody = JSON.stringify({userId, questionId, answerString, answeredTime})
    const response = await restApi.put(`/games/${gameId}/question`, requestBody, {headers: {token: localStorage.getItem("token")}})
    return response;
  }
  catch (error) {
    console.error(`Something went wrong while saving your answer in the server: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while saving your answer in the server! See the console for details.");
  }
};

export const finishGame = async () => {
  try {
    const gameId = localStorage.getItem('gameId');
    const authToken = localStorage.getItem('token');
    await restApi.delete(`/games/${gameId}/finish`, {headers: {token: authToken}});
  } catch (error) {
    throw new Error(`Something went wrong during fetching final results: \n${handleError(error)}`);
  }
};

export const getFinalResults = async () => {
  try {
    const gameId = localStorage.getItem('gameId');
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/games/${gameId}/finish`, {headers: {token: authToken}});
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong during fetching final results: \n${handleError(error)}`);
  }
};

export const getIntermediateResults = async () => {
  try {
    const gameId = localStorage.getItem('gameId');
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/games/${gameId}/intermediate`, {headers: {token: authToken}});
    return response;
  } catch (error) {
    throw new Error(`Something went wrong during fetching intermediate results: \n${handleError(error)}`);
  }
};

export const getUser = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('token');
    const response = await restApi.get(`/users/${userId}`,{headers: {token: authToken}});
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong during fetching intermediate results: \n${handleError(error)}`);
  }
};

export const cancelGame = async (id) => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await restApi.post(`/games/${id}/termination`, null,{headers: {token: authToken}});
    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong while cancelling the game: \n${handleError(error)}`);
  }
}

export const resetPassword = async (email) => {
  try {
    const requestBody = JSON.stringify({email: email})
    const response = await restApi.post('/reset', requestBody);
    return response;
  } catch (error) {
    throw new Error(`Something went wrong while resetting the password: \n${handleError(error)}`);
  }
}

