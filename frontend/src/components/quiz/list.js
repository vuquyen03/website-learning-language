import { Datagrid, List, EditButton, TextField, DeleteButton, SimpleList } from 'react-admin';
import { useMediaQuery, Theme } from "@mui/material";


const QuizList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => record.description}
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="description" />
          <EditButton basepath="/quizzes" />
          <DeleteButton basepath="/quizzes" />
        </Datagrid>
      )}
    </List>
  );
};

export default QuizList;