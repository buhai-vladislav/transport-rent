import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TransportForm } from '../TransportForm';
import { validationSchema } from '../TransportForm/TransportForm.utils';
import { ITransportFormProps } from '../TransportForm/TransportForm.props';
import {
  useLazyGetSingleTransportQuery,
  useRemoveTransportMutation,
  useUpdateTransportMutation,
} from '../../store/api/transport.api';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';
import { useUploadImage } from '../../hooks/useUploadImage';
import AvatarEditor from 'react-avatar-editor';
import { IAffectedResult, IResponse } from '../../types/Response';
import { ITransport, LicenceType, TransportType } from '../../types/Transport';
import { IMutation } from '../../types/RTK';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Loading, Modal, Text } from '@nextui-org/react';
import { useAppSelector } from '../../store/hooks/hooks';
import {
  useLazyGetRentInfoQuery,
  useUpdateRentMutation,
} from '../../store/api/rent.api';
import { IRent } from '../../types/Rent';
import { getDateDiffInMinutes } from '../../utils/date';

export const EditTransport = () => {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.user);
  const [getTransport, { error: tError, data: transportData, isFetching }] =
    useLazyGetSingleTransportQuery();
  const [image, setImage] = useState<File | string>('');
  const [opened, setOpened] = useState(false);
  const imageRef = useRef<AvatarEditor>(null);
  const navigate = useNavigate();
  const [updateTransport, { error }] = useUpdateTransportMutation();
  const [data, uploadImage] = useUploadImage();
  const [getRentInfo, { data: rentInfo }] = useLazyGetRentInfoQuery();
  const [stopRent, { isLoading }] = useUpdateRentMutation();
  const [removeTransport, { isLoading: isRemoving, error: rError }] =
    useRemoveTransportMutation();

  const removeHandler = useCallback(async () => {
    if (id) {
      const response: IMutation<IResponse<IAffectedResult>> =
        await removeTransport(id);
      if (response?.data?.data) {
        toast('Transport removed successfully', {
          type: 'success',
          position: 'bottom-center',
        });
        navigate('/transports');
      }
    }
  }, []);

  const stopRentHandler = useCallback(async () => {
    if (id && rentInfo?.data?._id) {
      const response: IMutation<IResponse<IRent>> = await stopRent({
        id: rentInfo?.data?._id,
        stoppedAt: new Date(),
        toDate: new Date(),
        transportId: id,
      });
      if (response?.data?.data) {
        toast('Rent stopped successfully', {
          type: 'success',
          position: 'bottom-center',
        });
      }
      closeModal();
    }
  }, [id, rentInfo?.data]);

  const openModal = useCallback(() => {
    setOpened(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpened(false);
  }, []);

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
  useErrorToast(
    rError,
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
    <>
      <TransportForm
        formik={formik}
        image={image}
        setImage={setImage}
        imageRef={imageRef}
        disabled={user?.role !== 'ADMIN'}
        id={id}
        rented={transportData?.data?.status !== 'FREE'}
        buttons={
          rentInfo?.data?.stoppedAt === null && user?.role === 'USER' ? (
            <Button color="warning" type="button" onPress={openModal}>
              Stop rent
            </Button>
          ) : (
            user?.role === 'ADMIN' && (
              <Button.Group>
                <Button
                  color="primary"
                  type="button"
                  onPress={removeHandler}
                  css={{ width: '50%' }}
                >
                  {isRemoving ? <Loading size="sm" /> : 'Remove'}
                </Button>
                <Button
                  className="submit"
                  type="submit"
                  ghost
                  css={{ width: '50%' }}
                >
                  {formik.isSubmitting ? <Loading size="sm" /> : 'Update'}
                </Button>
              </Button.Group>
            )
          )
        }
      />
      <Modal
        closeButton
        onClose={closeModal}
        open={opened}
        blur
        aria-labelledby="modal-rent"
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Stop renting the&nbsp;
            <Text b size={18}>
              {formik.values.title}
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text css={{ textAlign: 'center' }}>
            Your amount due is: &nbsp;
            <Text b>
              {transportData?.data?.price &&
                rentInfo?.data?.fromDate &&
                (transportData?.data?.price / 60) *
                  getDateDiffInMinutes(
                    new Date(rentInfo?.data?.fromDate),
                    new Date(),
                  )}
            </Text>
            $
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeModal}>
            Close
          </Button>
          <Button auto onPress={stopRentHandler} disabled={isLoading}>
            {isLoading ? <Loading size="sm" /> : 'Stop'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
