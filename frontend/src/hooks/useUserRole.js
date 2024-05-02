import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkRole } from '../redux/actions/userActions';

/**
 * Using this hook, we can check the user's role status and process status.
 * @returns userRole and userRoleDone status.
 */

const useUserRole = () => {
    const userRole = useSelector(state => state.user.userRole);
    const [userRoleDone, setUserRoleDone] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(checkRole());
                setUserRoleDone(true);
            } catch (error) {
                console.error('Error checking role:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    return { userRole, userRoleDone };
}

export default useUserRole;