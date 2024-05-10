import { SimpleForm, Create, required, TextInput} from 'react-admin';

const CourseCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="courseTitle" validate={required()} />
                <TextInput source="description" validate={required()} />
            </SimpleForm>
        </Create>
    )
}

export default CourseCreate;