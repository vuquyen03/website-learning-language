import React from "react";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Admin, Resource } from 'react-admin';
import { Navigate, Link } from 'react-router-dom';
import simpleRestProvider from "ra-data-simple-rest";
import CourseList from "../components/CourseList.Admin";
import UserList from "../components/UserList.Admin";

const dataProvider = simpleRestProvider('http://localhost:5000');


const AdminPanel = () => {

    return (
        <Admin dataProvider={dataProvider} basename="/adminPanel">
            <Resource
                name="/"/>
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