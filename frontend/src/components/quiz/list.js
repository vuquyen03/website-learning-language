import {
    Datagrid,
    List,
    NumberField,
    ReferenceField,
    EditButton,
    TextField,
    DeleteButton
} from "react-admin";

const ChallengeList = () => {
    return (
        <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="level" />
            <TextField source="description" />     
            <EditButton basepath="/quizzes" />
            <DeleteButton basepath="/quizzes" />
        </Datagrid>
    </List>
    );
};

export default ChallengeList;
