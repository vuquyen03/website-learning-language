import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkStatus } from '../redux/actions/userActions';

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