import { SimpleForm, Create, required, TextInput, NumberInput } from 'react-admin';

const CourseCreate = (props) => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="courseTitle" validate={required()} />
                <TextInput source="description" validate={required()} />
                <NumberInput source="estimatedTime" validate={required()} />
                <TextInput source="level" validate={required()} />
            </SimpleForm>
        </Create>
    )
}

export default CourseCreate;