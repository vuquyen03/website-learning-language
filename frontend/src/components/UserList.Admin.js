import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
} from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="role" />
            <TextField source="experience" />
            <DateField source="createdAt" />
            <EditButton basePath="/users" />
            <DeleteButton basePath="/users" />
        </Datagrid>
    </List>
);

export default UserList;