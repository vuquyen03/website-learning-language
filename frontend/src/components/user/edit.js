import { SimpleForm, Edit, required, NumberInput, ReferenceInput, SelectInput, TextField  } from 'react-admin';

const UserEdit = (props) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextField source="username"/>
                <NumberInput source="experience"/>
                <SelectInput
                    source="role"
                    validate={required()}
                    choices={[
                        { id: 'user', name: 'user' },
                        { id: 'admin', name: 'admin' },
                    ]}
                />
            </SimpleForm>
        </Edit>
    )
}

export default UserEdit;