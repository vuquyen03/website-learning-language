import { SimpleForm, Edit, required, NumberInput, ReferenceInput, SelectInput, TextField } from 'react-admin';

const UserEdit = (props) => {
    return (
        <div className="w-full min-h-[calc(100vh-72px)] py-14 px-10">
            <Edit {...props}>
                <SimpleForm>
                    <TextField source="username" />
                    <NumberInput source="experience" />
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
        </div>
    )
}

export default UserEdit;