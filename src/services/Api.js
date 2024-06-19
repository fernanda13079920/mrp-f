import axios from "axios";



const header = {
    headers: {
        'ip': '26.177.65.245'
    }
};

export const registerRequest = (user) => axios.post(`/register`, user, header);

export const loginRequest = (user) => axios.post(`/login`, user, header);

export const verifyTokenRequest = () => axios.get('/verify', header)