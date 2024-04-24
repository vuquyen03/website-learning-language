import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkRole } from '../redux/actions/userActions';

/**
 * Using this hook, we can check the user's role status and process status.
 * @returns userRole and userRoleDone status.
 */

const UserRole = () => {
    const userRole = useSelector(state => state.user.userRole);
    const [userRoleDone, setUserRoleDone] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkRole()).then
            (() => {
                setUserRoleDone(true);
            });
    }

        , [dispatch]);

    return { userRole, userRoleDone };
}

export default UserRole;