import axios from 'axios';

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
            dispatch(setUserRole(null)); // Clear user role
        }
    } catch (error) {
        console.log('Error logging out:', error);
    }
};


export const checkRole = () => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`, { withCredentials: true });
        if (response.status === 200) {
            dispatch(setUserRole(response.data.role));
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
    }
}