import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { ImageEditor } from '../../shared/ImageEditor';
import { TransportFormWrapper } from './TransportForm.presets';
import { ITransportProps } from './TransportForm.props';
import {
  Button,
  FormElement,
  Input,
  Loading,
  Modal,
  Textarea,
  Text,
} from '@nextui-org/react';
import { INPUT_WIDTH } from '../../utils/constants';
import { LicenceType, TransportType } from '../../types/Transport';
import { Select } from './components/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRentTransportMutation } from '../../store/api/rent.api';
import { IMutation } from '../../types/RTK';
import { IRent } from '../../types/Rent';
import { IResponse } from '../../types/Response';
import { toast } from 'react-toastify';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';

export const TransportForm: FC<ITransportProps> = ({
  formik,
  image,
  setImage,
  disabled,
  imageRef,
  id,
  rented,
  buttons,
}) => {
  const [opened, setOpened] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rentTransport, { isLoading, error }] = useRentTransportMutation();

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const openModal = useCallback(() => {
    setOpened(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpened(false);
  }, []);
  const changeNumberValue = useCallback(
    (name: string) =>
      ({ target }: ChangeEvent<FormElement>) => {
        formik.setFieldValue(name, Number(target.value.replaceAll('e', '')));
      },
    [],
  );

  const selecetChange = useCallback(
    (name: string) => (keys: Selection) => {
      formik.setFieldValue(name, Array.from(keys as unknown as Set<string>)[0]);
    },
    [],
  );

  const getDiffInDays = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }
    if (startDate?.getTime() === endDate?.getTime()) {
      return 1;
    }
    return (
      Math.abs(startDate?.getTime() - endDate?.getTime()) / (1000 * 3600 * 24)
    );
  }, [startDate, endDate]);

  const rentHandler = useCallback(async () => {
    if (id && startDate && endDate) {
      const response: IMutation<IResponse<IRent>> = await rentTransport({
        transportId: id,
        fromDate: startDate,
        toDate: endDate,
      });

      if (response.data?.data) {
        toast(response.data.message, {
          position: 'bottom-center',
          type: 'success',
        });
      }
      setOpened(false);
    }
  }, [startDate, endDate, id]);

  useErrorToast(error, [
    { status: HttpStatus.INTERNAL_SERVER_ERROR },
    { status: HttpStatus.BAD_REQUEST },
  ]);

  return (
    <TransportFormWrapper onSubmit={formik.handleSubmit}>
      <div className="top-block">
        <ImageEditor
          image={image ?? ''}
          setImage={setImage}
          imageRef={imageRef}
          borderRadius={0}
          disabled={disabled}
        />
        <div className="title-info bg-paper">
          <div className="inputs-block">
            <Input
              color="primary"
              rounded
              status={!!formik.errors.title ? 'error' : 'default'}
              helperText={formik.errors.title}
              label="Tile"
              onChange={formik.handleChange}
              name="title"
              value={formik.values.title}
              width={INPUT_WIDTH}
              disabled={disabled}
            />
            <Input
              color="primary"
              rounded
              status={!!formik.errors.price ? 'error' : 'default'}
              helperText={formik.errors.price}
              label="Price"
              onChange={formik.handleChange}
              name="price"
              type="number"
              value={formik.values.price}
              width={INPUT_WIDTH}
              disabled={disabled}
              labelRight="$"
              min={1}
            />
            <Input
              color="primary"
              rounded
              status={!!formik.errors.maxSpeed ? 'error' : 'default'}
              helperText={formik.errors.maxSpeed}
              label="Max speed"
              onChange={changeNumberValue('maxSpeed')}
              name="maxSpeed"
              type="number"
              value={formik.values.maxSpeed}
              width={INPUT_WIDTH}
              disabled={disabled}
              labelRight="km/h"
              min={1}
            />
            <Input
              color="primary"
              rounded
              status={!!formik.errors.weight ? 'error' : 'default'}
              helperText={formik.errors.weight}
              label="Weight"
              onChange={changeNumberValue('weight')}
              name="weight"
              type="number"
              value={formik.values.weight}
              width={INPUT_WIDTH}
              disabled={disabled}
              labelRight="kg"
              min={1}
            />
            <Input
              color="primary"
              rounded
              status={!!formik.errors.seats ? 'error' : 'default'}
              helperText={formik.errors.seats}
              label="Seats"
              onChange={changeNumberValue('seats')}
              name="seats"
              type="number"
              value={formik.values.seats}
              width={INPUT_WIDTH}
              disabled={disabled}
              min={1}
            />
            <Input
              color="primary"
              rounded
              status={!!formik.errors.power ? 'error' : 'default'}
              helperText={formik.errors.power}
              label="Power"
              onChange={changeNumberValue('power')}
              name="power"
              type="number"
              value={formik.values.power}
              width={INPUT_WIDTH}
              disabled={disabled}
              labelRight="hp"
              min={1}
            />
            <Select
              value={formik.values.type}
              setValue={selecetChange('type')}
              type={TransportType}
              title="Transport type"
              disabled={disabled}
            />
            <Select
              value={formik.values.licenceType}
              setValue={selecetChange('licenceType')}
              type={LicenceType}
              title="Licence type"
              disabled={disabled}
            />
            <div className="color-block">
              <input
                type="color"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                disabled={disabled}
              />
              <label htmlFor="color">Color</label>
            </div>
          </div>
          <Textarea
            color="primary"
            status={!!formik.errors.description ? 'error' : 'default'}
            helperText={formik.errors.description}
            label="Description"
            onChange={formik.handleChange}
            name="description"
            value={formik.values.description}
            disabled={disabled}
          />
          {!buttons ? (
            <Button type="button" onPress={openModal} disabled={rented}>
              {rented ? 'In rent' : 'Rent'}
            </Button>
          ) : (
            buttons
          )}
        </div>
      </div>
      <Modal
        closeButton
        onClose={closeModal}
        open={opened}
        blur
        aria-labelledby="modal-rent"
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Rent the&nbsp;
            <Text b size={18}>
              {formik.values.title}
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={new Date()}
          />
          <Input
            value={getDiffInDays * formik.values.price * 24}
            disabled
            labelLeft="Price"
            labelRight="$"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeModal}>
            Close
          </Button>
          <Button
            auto
            onPress={rentHandler}
            disabled={endDate === null || startDate === null || isLoading}
          >
            {isLoading ? <Loading size="sm" /> : 'Rent'}
          </Button>
        </Modal.Footer>
      </Modal>
    </TransportFormWrapper>
  );
};
