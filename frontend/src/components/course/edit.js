import { SimpleForm, Edit, required, TextInput, NumberInput, ReferenceInput } from 'react-admin';

const CourseEdit = (props) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="courseTitle" validate={required()} />
                <TextInput source="description" validate={required()} />
                <NumberInput source="estimatedTime" validate={required()} />
                <TextInput source="level" validate={required()} />
            </SimpleForm>
        </Edit>
    )
}

export default CourseEdit;