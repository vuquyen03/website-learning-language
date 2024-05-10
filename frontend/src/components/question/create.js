import React from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';

const QuestionCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="question" validate={[required()]} />
            <TextInput source="correctOption" validate={required()}/>
        </SimpleForm>
    </Create>
);

export default QuestionCreate;
