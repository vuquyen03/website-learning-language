import axios from 'axios';

export const setLoggedIn = (loggedIn) => {
    // localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
    return {
        type: 'SET_LOGGED_IN',
        payload: loggedIn
    };
};

export const checkStatus = () => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-login`, { withCredentials: true });
        if (response.status === 200) {
            dispatch(setLoggedIn(true));
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
};

export const logout = () => async dispatch => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, { withCredentials: true });
        if (response.status === 200) {
            dispatch(setLoggedIn(false));
        }
    } catch (error) {
        console.log('Error logging out:', error);
    }
};