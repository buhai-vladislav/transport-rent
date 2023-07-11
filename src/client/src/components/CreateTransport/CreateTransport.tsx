import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TransportForm } from '../TransportForm';
import { validationSchema } from '../TransportForm/TransportForm.utils';
import { ITransportFormProps } from '../TransportForm/TransportForm.props';
import { useCreateTransportMutation } from '../../store/api/transport.api';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';
import { useUploadImage } from '../../hooks/useUploadImage';
import AvatarEditor from 'react-avatar-editor';
import { IResponse } from '../../types/Response';
import { ITransport, LicenceType, TransportType } from '../../types/Transport';
import { IMutation } from '../../types/RTK';
import { toast } from 'react-toastify';

export const CreateTransport = () => {
  const [image, setImage] = useState<File | string>('');
  const imageRef = useRef<AvatarEditor>(null);
  const [createTransport, { error }] = useCreateTransportMutation();
  const [data, uploadImage] = useUploadImage();
  const onSubmit = useCallback(
    async ({
      price,
      title,
      description,
      maxSpeed,
      type,
      weight,
      seats,
      power,
      color,
      licenceType,
    }: ITransportFormProps) => {
      const imageId = await uploadImage(image, imageRef);
      const response: IMutation<IResponse<ITransport>> = await createTransport({
        price,
        title,
        imageId,
        description: {
          color,
          description,
          maxSpeed,
          power,
          seats,
          type: Array.from(type)[0],
          weight,
          licenceType: Array.from(licenceType)[0],
        },
      });
      if (response.data) {
        toast('Transport created successfully', {
          type: 'success',
          position: 'bottom-center',
        });
        formik.resetForm();
        setImage('');
      }
    },
    [image, data?.data],
  );
  const formik = useFormik<ITransportFormProps>({
    initialValues: {
      price: 1,
      title: '',
      description: '',
      maxSpeed: 1,
      type: new Set([TransportType.CAR]),
      weight: 1,
      seats: 1,
      power: 1,
      color: '#ffffff',
      licenceType: new Set([LicenceType.A]),
    },
    onSubmit,
    validationSchema,
    validateOnChange: false,
  });

  useErrorToast(
    error,
    [
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.BAD_REQUEST },
    ],
    {
      position: 'bottom-center',
      type: 'error',
    },
  );

  return (
    <TransportForm
      formik={formik}
      image={image}
      setImage={setImage}
      imageRef={imageRef}
    />
  );
};
