import React from 'react';
import { SimpleForm, TextInput, ArrayInput, SimpleFormIterator, required, Edit, ReferenceInput, SelectInput } from 'react-admin';

const QuestionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="question" validate={[required()]} />
            <TextInput source="correctOption" validate={required()}/>
            <ArrayInput source="incorrectOptions">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>
            <ReferenceInput source="quiz" reference="quiz">
                <SelectInput optionText="title" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export default QuestionEdit;
