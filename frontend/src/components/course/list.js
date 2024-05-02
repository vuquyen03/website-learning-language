import React from "react";
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    FunctionField
} from 'react-admin';

const formatEstimatedTime = (record) => {
    const estimatedHours = record.estimatedTime;
    return `${estimatedHours} hours`;
};

const CourseList = () => (

    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="courseTitle" />
            <TextField source="description" />
            <FunctionField
                label="Estimated Time"
                render={formatEstimatedTime}
                sortBy="estimatedTime"
            />            
            <EditButton basepath="/courses" />
            <DeleteButton basepath="/courses" />
        </Datagrid>
    </List>

)

export default CourseList;