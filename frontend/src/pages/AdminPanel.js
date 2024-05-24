import React from "react";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import QuizIcon from '@mui/icons-material/Quiz';
import { Admin, Resource, UserMenu, nanoLightTheme, nanoDarkTheme } from 'react-admin';
import CourseList from "../components/course/list";
import UserList from "../components/user/list";
import dataProvider from "../providers/dataProvider";
import CourseCreate from "../components/course/create";
import CourseEdit from "../components/course/edit";
import QuizList from "../components/quiz/list";
import UserEdit from "../components/user/edit";
import QuizCreate from "../components/quiz/create";
import QuizEdit from "../components/quiz/edit";
import QuestionList from "../components/question/list";
import QuestionCreate from "../components/question/create";
import QuestionEdit from "../components/question/edit";
import { Dashboard } from "../components/home/page";


const AdminPanel = () => {

    return (
        <Admin dataProvider={dataProvider} basename="/adminPanel" theme={nanoLightTheme} darkTheme={nanoDarkTheme} dashboard={Dashboard}>
            <Resource
                name="user"
                recordRepresentation="username"
                list={UserList}
                edit={UserEdit}
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
                recordRepresentation="title"
                list={QuizList}
                create={QuizCreate}
                edit={QuizEdit}
                icon={QuizIcon}
            />

            <Resource 
                name="question"
                recordRepresentation="question"
                list={QuestionList}
                create={QuestionCreate}
                edit={QuestionEdit}/>

        </Admin>
    );
}

export default AdminPanel;