import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkStatus } from '../redux/actions/userActions';


/**
 * Using this hook, we can check the user's login status and loading status.
 * @returns loggedIn and isLoading status.
 */
const UserStatus = () => {
    const loggedIn = useSelector(state => state.user.loggedIn);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(checkStatus()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    return { loggedIn, isLoading };
};

export default UserStatus;