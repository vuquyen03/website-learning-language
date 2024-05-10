import { SimpleForm, Edit, required, TextInput, NumberInput, SelectArrayInput, SelectInput, ReferenceArrayInput } from 'react-admin';

const CourseEdit = () => {
    return (
        <Edit >
            <SimpleForm>
                <TextInput source="courseTitle" validate={required()} />
                <TextInput source="description" validate={required()} />
                <NumberInput source="estimatedTime" validate={required()} />
                <ReferenceArrayInput source="quiz" reference="quiz">
                    <SelectArrayInput optionText="title" />
                </ReferenceArrayInput>
                <SelectInput
                    source="level"
                    validate={required()}
                    choices={[
                        { id: 'Beginner', name: 'Beginner' },
                        { id: 'Intermediate', name: 'Intermediate' },
                        { id: 'Advanced', name: 'Advanced' },
                    ]}
                />
            </SimpleForm>
        </Edit>
    )
}

export default CourseEdit;