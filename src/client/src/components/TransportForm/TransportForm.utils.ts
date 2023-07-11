import { number, object, string } from 'yup';

export const validationSchema = object({
  price: number()
    .required('Price is required.')
    .min(1, 'Price must be greater than 0.'),
  title: string().required('Title is required.'),
  description: string().required('Description is required.'),
  maxSpeed: number()
    .required('Max speed is required.')
    .min(1, 'Max speed must be greater than 0.'),
  type: string().required('Type is required.'),
  weight: number()
    .required('Weight is required.')
    .min(1, 'Weight must be greater than 0.'),
  seats: number()
    .required('Seats is required.')
    .min(1, 'Seats must be greater than 0.'),
  power: number()
    .required('Power is required.')
    .min(1, 'Power must be greater than 0.'),
  color: string().required('Color is required.'),
  licenceType: string().required('Licence type is required.'),
});
