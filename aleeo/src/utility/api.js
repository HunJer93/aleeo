import axios from 'axios';

const ENV_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_URL_DEV : process.env.REACT_APP_URL_PROD;


const apiClient = axios.create({
    baseURL: ENV_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;