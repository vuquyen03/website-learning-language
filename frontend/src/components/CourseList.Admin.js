import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
} from 'react-admin';

const CourseList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="courseTitle" />
                <TextField source="description" />
                <DateField source="estimateTime" />
                <EditButton basePath="/courses" />
                <DeleteButton basePath="/courses" />
            </Datagrid>
        </List>
    );
}

export default CourseList;