import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const setLoggedIn = (loggedIn) => {
    return {
        type: 'SET_LOGGED_IN',
        payload: loggedIn
    };
};

export const setUserRole = (role) => ({
    type: "SET_USER_ROLE",
    payload: role,
});

export const setExpirationTime = (expirationTime) => {
    localStorage.setItem('expirationTime', expirationTime);
    return {
        type: "SET_EXPIRATION_TIME",
        payload: expirationTime,
    };
};

export const checkStatus = () => async dispatch => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/user/check-login', { withCredentials: true });
        if (response.status === 200) {
            dispatch(setLoggedIn(true));
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
};

export const logout = () => async dispatch => {
    try {
        const response = await axios.post(process.env.REACT_APP_API_URL + '/user/logout', null, { withCredentials: true });
        if (response.status === 200) {
            dispatch(setLoggedIn(false));
            dispatch(setUserRole(null)); // Clear user role
            localStorage.removeItem('expirationTime');
        }
    } catch (error) {
        console.log('Error logging out:', error);
    }
};

export const refreshAccessToken = () => async dispatch => {
    try {
        const response = await axios.post(process.env.REACT_APP_API_URL + '/user/refresh-token', null, { withCredentials: true });
        if (response.status === 200) {
            console.log("response:", jwtDecode(response.data.accessToken).exp);
            dispatch(setExpirationTime(jwtDecode(response.data.accessToken).exp));
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
};

export const checkRole = () => async dispatch => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/user/role', { withCredentials: true });
        if (response.status === 200) {
            dispatch(setUserRole(response.data.role));
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
    }
}
