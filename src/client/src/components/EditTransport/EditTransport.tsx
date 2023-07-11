import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TransportForm } from '../TransportForm';
import { validationSchema } from '../TransportForm/TransportForm.utils';
import { ITransportFormProps } from '../TransportForm/TransportForm.props';
import {
  useCreateTransportMutation,
  useLazyGetSingleTransportQuery,
  useUpdateTransportMutation,
} from '../../store/api/transport.api';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';
import { useUploadImage } from '../../hooks/useUploadImage';
import AvatarEditor from 'react-avatar-editor';
import { IResponse } from '../../types/Response';
import { ITransport, LicenceType, TransportType } from '../../types/Transport';
import { IMutation } from '../../types/RTK';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Loading } from '@nextui-org/react';
import { useAppSelector } from '../../store/hooks/hooks';
import { useLazyGetRentInfoQuery } from '../../store/api/rent.api';

export const EditTransport = () => {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.user);
  const [getTransport, { error: tError, data: transportData, isFetching }] =
    useLazyGetSingleTransportQuery();
  const [image, setImage] = useState<File | string>('');
  const imageRef = useRef<AvatarEditor>(null);
  const [updateTransport, { error }] = useUpdateTransportMutation();
  const [data, uploadImage] = useUploadImage();
  const [getRentInfo] = useLazyGetRentInfoQuery();

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
      if (id) {
        const imageId = await uploadImage(image, imageRef);
        const response: IMutation<IResponse<ITransport>> =
          await updateTransport({
            transport: {
              price,
              title,
            },
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
            imageId,
            id,
          });
        if (response.data) {
          toast('Transport updated successfully', {
            type: 'success',
            position: 'bottom-center',
          });
          formik.resetForm();
          setImage('');
        }
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

  useEffect(() => {
    if (transportData?.data) {
      const { description, title, price, image } = transportData.data;
      const {
        color,
        maxSpeed,
        power,
        seats,
        type,
        weight,
        licenceType,
        description: descText,
      } = description;
      formik.setValues({
        title,
        price,
        color,
        licenceType: new Set([licenceType!]),
        maxSpeed,
        power,
        seats,
        type: new Set([type!]),
        weight,
        description: descText,
      });

      if (image) {
        setImage(image.fileSrc);
      }
    }
  }, [transportData]);

  useEffect(() => {
    if (id) {
      Promise.all([getTransport(id), getRentInfo(id)]).catch((err) =>
        console.log(err),
      );
    }
  }, [id]);

  if (isFetching) {
    return <Loading size="xl" />;
  }

  return (
    <TransportForm
      formik={formik}
      image={image}
      setImage={setImage}
      imageRef={imageRef}
      disabled={user?.role !== 'ADMIN'}
      id={id}
      rented={transportData?.data?.status !== 'FREE'}
    />
  );
};
