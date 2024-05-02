import { useEffect, useState } from "react";
import { refreshAccessToken } from "../redux/actions/userActions";
import { useDispatch } from 'react-redux';

/**
 * Using this hook, we can refresh the access token when it is about to expire
 * @returns accessTokenDone status.
 */
const useAccessTokenWithRefresh = () => {
    const [accessTokenDone, setAccessTokenDone] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const refreshToken = async () => {
            console.log("Calling Refresh Token")
            const currentTime = new Date(Date.now());
            const expirationTime = localStorage.getItem("expirationTime");

            if (currentTime/1000 > expirationTime - 60 * 2){
                try {
                    await dispatch(refreshAccessToken());
                    console.log("refreshToken called");
                    setAccessTokenDone(true);
                } catch (error) {
                    console.error('Error refreshing access token:', error);
                }
            }
        };
        refreshToken();
    });

    return { accessTokenDone };
}

export default useAccessTokenWithRefresh;