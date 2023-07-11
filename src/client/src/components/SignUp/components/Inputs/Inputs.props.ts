import { FormikProps } from 'formik';
import { IFormProps } from '../../SignUp.props';

export interface IInputsProps {
  formik: FormikProps<IFormProps>;
  stepHandler: () => void;
}
