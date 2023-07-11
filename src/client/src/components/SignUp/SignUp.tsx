import { Button, Loading, Text } from '@nextui-org/react';
import { FormWrapper } from '../../shared/FormWrapper';
import { useCallback, useRef, useState } from 'react';
import { IFormProps } from './SignUp.props';
import { useFormik } from 'formik';
import { Inputs } from './components/Inputs/Inputs';
import { StepWrapper } from './Signup.presets';
import { ImageEditor } from '../../shared/ImageEditor';
import { object, ref, string } from 'yup';
import { useSignupMutation } from '../../store/api/main.api';
import { IMutation } from '../../types/RTK';
import { IResponse } from '../../types/Response';
import { IUser } from '../../types/User';
import AvatarEditor from 'react-avatar-editor';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';
import { ToastOptions } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUploadImage } from '../../hooks/useUploadImage';

const validationSchema = object({
  name: string().required('Fullname is required'),
  email: string().email('Invalid email format.').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters'),
});

export const SignUp = () => {
  const [step, setStep] = useState(0);
  const [signup, { error }] = useSignupMutation();
  const [uploadedImage, uploadImage] = useUploadImage();
  const imageRef = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string>('');
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async ({ email, name, password }: IFormProps) => {
      const imageId = await uploadImage(image, imageRef);
      const response: IMutation<IResponse<IUser>> = await signup({
        email,
        password,
        name,
        imageId: uploadedImage?.data?._id ?? imageId,
      });

      if (response.data) {
        navigate('/signin');
      }
    },
    [image, uploadedImage?.data],
  );
  const changeStep = useCallback(
    (step: number) => async () => {
      const values = await formik.validateForm();
      if (step === 1) {
        if (!Object.keys(values).length) {
          setStep(step);
        }
      } else {
        setStep(step);
      }
    },
    [],
  );

  const formik = useFormik<IFormProps>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit,
    validationSchema,
  });

  const toastOptions: ToastOptions = {
    position: 'bottom-center',
    type: 'error',
  };

  useErrorToast(
    error,
    [{ status: HttpStatus.INTERNAL_SERVER_ERROR }],
    toastOptions,
  );

  return (
    <>
      <FormWrapper onSubmit={formik.handleSubmit}>
        <Text h3>Sign Up</Text>
        <StepWrapper>
          {step === 0 ? (
            <Inputs formik={formik} stepHandler={changeStep(1)} />
          ) : (
            <ImageEditor
              image={image}
              setImage={setImage}
              imageRef={imageRef}
              buttons={
                <Button.Group
                  style={{ width: '300px' }}
                  disabled={formik.isSubmitting}
                >
                  <Button ghost onClick={changeStep(0)}>
                    Back
                  </Button>
                  <Button onClick={changeStep(1)} type="submit">
                    {formik.isSubmitting ? (
                      <Loading color="currentColor" size="sm" />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </Button.Group>
              }
            />
          )}
          <div className="steps">
            {[0, 1].map((item) => (
              <button
                type="button"
                key={item}
                className={item === step ? 'active' : ''}
              />
            ))}
          </div>
        </StepWrapper>
      </FormWrapper>
    </>
  );
};
