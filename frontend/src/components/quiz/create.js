import {
    Create,
    NumberInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
    required,
    ReferenceArrayInput,
    SelectArrayInput
} from "react-admin";

const QuizCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={required()} label="Description" />
            </SimpleForm>
        </Create>
    );
};

export default QuizCreate;