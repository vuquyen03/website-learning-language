import React from "react";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Admin, Resource } from 'react-admin';
import { Navigate, Link } from 'react-router-dom';
import simpleRestProvider from "ra-data-simple-rest";
import CourseList from "../components/CourseList.Admin";
import UserList from "../components/UserList.Admin";

const dataProvider = simpleRestProvider("/api");


function AdminPanel() {
    const isAdmin = true;

    if (!isAdmin) {
        return <Navigate to="/error" state={{ message: 'Unauthorized' }} />;
    }
    return (
        <Admin dataProvider={dataProvider}>
            {/* <Resource
                name="admin"
            /> */}
            <Resource
                name="users"
                recordRepresentation="username"
                list={UserList}
                icon={UserIcon}
            />

            <Resource
                name="courses"
                recordRepresentation="courseTitle"
                list={CourseList}
                icon={PostIcon}
            />
        </Admin>
    );
}

export default AdminPanel;