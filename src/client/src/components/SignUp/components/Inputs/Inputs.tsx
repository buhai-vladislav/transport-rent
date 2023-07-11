import { Button, Input } from '@nextui-org/react';
import { FC } from 'react';
import { IInputsProps } from './Inputs.props';
import { INPUT_WIDTH } from '../../../../utils/constants';

export const Inputs: FC<IInputsProps> = ({ formik, stepHandler }) => {
  return (
    <>
      <Input
        color="primary"
        rounded
        status={!!formik.errors.name ? 'error' : 'default'}
        helperText={formik.errors.name}
        label="Fullname"
        onChange={formik.handleChange}
        name="name"
        value={formik.values.name}
        width={INPUT_WIDTH}
      />
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
      <Input.Password
        color="primary"
        rounded
        label="Password"
        status={!!formik.errors.password ? 'error' : 'default'}
        helperText={formik.errors.password}
        onChange={formik.handleChange}
        name="password"
        value={formik.values.password}
        width={INPUT_WIDTH}
      />
      <Input.Password
        color="primary"
        rounded
        label="Confirm password"
        status={!!formik.errors.confirmPassword ? 'error' : 'default'}
        helperText={formik.errors.confirmPassword}
        onChange={formik.handleChange}
        name="confirmPassword"
        value={formik.values.confirmPassword}
        width={INPUT_WIDTH}
      />
      <Button type="button" onPress={stepHandler} disabled={!formik.isValid}>
        Next
      </Button>
    </>
  );
};
