import React from "react";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import QuizIcon from '@mui/icons-material/Quiz';
import { Admin, Resource } from 'react-admin';
import CourseList from "../components/course/list";
import UserList from "../components/user/list";
import dataProvider from "../providers/dataProvider";
import CourseCreate from "../components/course/create";
import CourseEdit from "../components/course/edit";
import QuizList from "../components/quiz/list";
const AdminPanel = () => {

    return (
        <Admin dataProvider={dataProvider} basename="/adminPanel">
            <Resource
                name="/home"/>
            <Resource
                name="user"
                recordRepresentation="username"
                list={UserList}
                icon={UserIcon}
            />

            <Resource
                name="course"
                recordRepresentation="courseTitle"
                list={CourseList}
                create={CourseCreate}
                edit={CourseEdit}
                icon={PostIcon}
            />

            <Resource 
                name="quiz"
                list={QuizList}
                icon={QuizIcon}/>

        </Admin>
    );
}

export default AdminPanel;