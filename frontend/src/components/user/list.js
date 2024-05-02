import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
} from 'react-admin';

const UserList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="role" />
            <TextField source="experience" />
            <DateField source="createdAt" />
            <EditButton basepath="/users" />
            <DeleteButton basepath="/users" />
        </Datagrid>
    </List>
);

export default UserList;