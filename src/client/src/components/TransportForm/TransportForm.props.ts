import { FormikProps } from 'formik';
import { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { LicenceType, TransportType } from '../../types/Transport';

interface ITransportFormProps {
  price: number;
  title: string;
  description: string;
  maxSpeed: number;
  type: Set<TransportType>;
  weight: number;
  seats: number;
  power: number;
  color: string;
  licenceType: Set<LicenceType>;
}

interface ITransportProps {
  image?: File | string;
  setImage: Dispatch<SetStateAction<File | string>>;
  formik: FormikProps<ITransportFormProps>;
  disabled?: boolean;
  imageRef: RefObject<AvatarEditor>;
  id?: string;
  rented?: boolean;
  unRentButton?: ReactNode;
}

export type { ITransportFormProps, ITransportProps };
