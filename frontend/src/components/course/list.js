import { useMediaQuery, Theme } from "@mui/material";
import React from "react";
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    FunctionField,
    SimpleList
} from 'react-admin';

const formatEstimatedTime = (record) => {
    const estimatedHours = record.estimatedTime;
    return `${estimatedHours} hours`;
};

const CourseList = () => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.courseTitle}
                    secondaryText={(record) => record.description}
                    tertiaryText={(record) => record.level}
                />
            ) : (
                <Datagrid rowClick="edit">
                    <TextField source="id" />
                    <TextField source="courseTitle" />
                    <TextField source="description" />
                    <TextField source="level" />
                    <FunctionField
                        label="Estimated Time"
                        render={formatEstimatedTime}
                        sortBy="estimatedTime"
                    />
                    <EditButton basepath="/courses" />
                    <DeleteButton basepath="/courses" />
                </Datagrid>
            )}

        </List>
    )
};

export default CourseList;