import { Button, Input, Loading, Text } from '@nextui-org/react';
import { FormWrapper } from '../../shared/FormWrapper';
import { useFormik } from 'formik';
import { ISignInFormProps } from './SignIn.props';
import { useCallback, useEffect } from 'react';
import { INPUT_WIDTH } from '../../utils/constants';
import { useSigninMutation } from '../../store/api/main.api';
import { useAppDispatch } from '../../store/hooks/hooks';
import { IResponse } from '../../types/Response';
import { IMutation } from '../../types/RTK';
import { useNavigate } from 'react-router-dom';
import { ISignInResponse } from '../../types/Auth';
import { setUser } from '../../store/reducers/user';
import { object, string } from 'yup';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';

const validationSchema = object({
  email: string()
    .email("It's not a valid email.")
    .required('Email is required.'),
  password: string().required('Password is required.'),
});

export const SignIn = () => {
  const [signin, { error }] = useSigninMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = useCallback(
    async ({ email, password }: ISignInFormProps) => {
      const response: IMutation<IResponse<ISignInResponse>> = await signin({
        email,
        password,
      });

      if (response?.data?.data?.user) {
        dispatch(setUser(response.data.data?.user));

        localStorage.setItem('accessToken', response.data.data?.accessToken);
        localStorage.setItem('refreshToken', response.data.data?.refreshToken);
        navigate('/');
      }
    },
    [],
  );

  const formik = useFormik<ISignInFormProps>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
    validationSchema,
    validateOnChange: false,
  });

  useErrorToast(
    error,
    [{ status: HttpStatus.BAD_REQUEST }, { status: HttpStatus.UNAUTHORIZED }],
    { position: 'bottom-center', type: 'error' },
  );

  return (
    <FormWrapper onSubmit={formik.handleSubmit}>
      <Text h3>Sign In</Text>
      <Input
        color="primary"
        rounded
        status={!!formik.errors.email ? 'error' : 'default'}
        helperText={formik.errors.email}
        label="Email"
        onChange={formik.handleChange}
        name="email"
        value={formik.values.email}
        width={INPUT_WIDTH}
      />
      <Input
        color="primary"
        rounded
        status={!!formik.errors.password ? 'error' : 'default'}
        helperText={formik.errors.password}
        label="Password"
        onChange={formik.handleChange}
        name="password"
        value={formik.values.password}
        width={INPUT_WIDTH}
        type="password"
      />
      <Button type="submit">
        {formik.isSubmitting ? <Loading size="sm" /> : 'Sign In'}
      </Button>
    </FormWrapper>
  );
};
