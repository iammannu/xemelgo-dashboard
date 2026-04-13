import axios from 'axios';  // Axios helps your app talk to a server

const api = axios.create({
  baseURL: 'http://localhost:5001/api',  // 5001 is the port where my backend server is running
});

api.interceptors.request.use((config) => {    // It gets the saved login token from localStorage and adds it to the Authorization header of every API request.
  const token = localStorage.getItem('token');    // fetches the data needed for authentication
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;