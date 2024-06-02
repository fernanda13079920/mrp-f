import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password
    }).then(response => {
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    });
};

const logout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return axios.post(`${API_URL}/logout`, {}, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    }).then(response => {
        localStorage.removeItem('user');
        return response.data;
    });
};

const authService = {
    login,
    logout
};

export default authService;
