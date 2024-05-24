import { SimpleForm, Edit, required, TextInput, NumberInput, AutocompleteArrayInput, SelectInput, ReferenceArrayInput, ImageInput, ImageField } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const validateFile = (file) => {
    console.log("Change Image", file)
    if (!file || typeof file !== 'object') {
        console.log("No file")
        return undefined; // No error if no file is provided or file is not an object
    }
    console.log(file);
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.title.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        return 'Invalid file type. Only JPG, JPEG, and PNG are allowed.';
    }
    return undefined; // No error
};

const CourseEdit = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('courseTitle', values.courseTitle);
            formData.append('description', values.description);
            formData.append('image', values.image.rawFile);
            formData.append('estimatedTime', values.estimatedTime);
            formData.append('level', values.level);
            formData.append('quiz', values.quiz);

            const response = await axios.put(process.env.REACT_APP_API_URL + '/course/edit/' + values.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-Token': localStorage.getItem('csrfToken')
                },
                withCredentials: true
            });
            localStorage.setItem('csrfToken', response.headers['x-csrf-token'])
            navigate('/adminPanel/course');
        } catch (error) {
            const csrfToken = error.response.headers['x-csrf-token'];
            localStorage.setItem('csrfToken', csrfToken);
            console.error('Error updating course:', error);
        }
    };
    return (
        <div className="w-full min-h-[calc(100vh-72px)] py-14 px-10">
            <Edit >
                <SimpleForm onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-between">
                            <div>
                                <TextInput source="courseTitle" validate={required()} inputProps={{ style: { width: '100%', fontSize: '20px' }}}/>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col">
                        <TextInput source="description" validate={required()} inputProps={{ style: { width: '100%', fontSize: '20px' }}} />
                    </div>

                    <div>
                        <NumberInput source="estimatedTime" validate={required()} />
                        <span>
                            <SelectInput
                                source="level"
                                validate={required()}
                                choices={[
                                    { id: 'Beginner', name: 'Beginner' },
                                    { id: 'Intermediate', name: 'Intermediate' },
                                    { id: 'Advanced', name: 'Advanced' },
                                ]}
                            />
                        </span>

                        <span>
                            <ReferenceArrayInput source="quiz" reference="quiz">
                                <AutocompleteArrayInput optionText="title" />
                            </ReferenceArrayInput>
                        </span>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-center items-center" >
                            <ImageField  source="image" title="Course Image"
                            sx={{ '& .RaImageField-image': { maxWidth: 800, maxHeight: 800, objectFit: 'contain' } }}/>
                        </div>
                    </div>

                    <ImageInput
                        source="image"
                        label="Change Image"
                        accept="image/*"
                        validate={validateFile}>
                        <ImageField source="src" title="title" />
                    </ImageInput>

                </SimpleForm>
            </Edit>
        </div>
    )
}

export default CourseEdit;