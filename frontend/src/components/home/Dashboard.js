import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/actions/userActions';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    }

    return (
        <Card>
            <CardHeader title="Welcome to the administration" />
            <CardContent>
                <div>
                    <Typography variant="h5" component="h2">
                        Learning English App Dashboard
                    </Typography>
                    <p>Welcome to the dashboard of the Learning English App.</p>
                    <p>Here, you can manage and view various aspects of the app.</p>
                    <div className="flex justify-end">
                        <button
                            className="mt-6 py-3 px-6 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-xl"
                            onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
};