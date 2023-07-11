import { IBase } from './Base';
import { IImage } from './Image';

enum TransportType {
  CAR = 'CAR',
  BUS = 'BUS',
  TRUCK = 'TRUCK',
  BIKE = 'BIKE',
  BICYCLE = 'BICYCLE',
}

enum RentStatus {
  IN_RENT = 'PENDING',
  FREE = 'FREE',
}

enum LicenceType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface ITransportCreate {
  price: number;
  title: string;
  description: {
    description: string;
    maxSpeed: number;
    type: string;
    weight: number;
    seats: number;
    power: number;
    color: string;
    licenceType?: string;
  };
  imageId?: string;
}

interface ITransportGetWhere {
  priceRange?: [number, number] | [string, string];
  maxSpeed?: number | string;
  color?: string;
  powerRange?: [number, number] | [string, string];
  type?: string;
  licenceType?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortKey?: string;
  search?: string;
}

enum SortKeys {
  'createdAt' = 'Date',
  'price' = 'Price',
  'title' = 'Title',
  'description.maxSpeed' = 'Max Speed',
  'description.type' = 'Type',
  'description.weight' = 'Weight',
  'description.power' = 'Power',
}

interface ITransportUpdate {
  transport?: {
    price?: number;
    title?: string;
  };
  description: {
    description?: string;
    maxSpeed?: number;
    type?: string;
    weight?: number;
    seats?: number;
    power?: number;
    color?: string;
    licenceType?: LicenceType;
  };
  imageId?: string;
  id: string;
}

interface ITransport extends IBase {
  price: number;
  title: string;
  description: {
    description: string;
    maxSpeed: number;
    type: TransportType;
    weight: number;
    seats: number;
    power: number;
    color: string;
    licenceType?: LicenceType;
  };
  status: RentStatus;
  image?: IImage;
}

export { TransportType, RentStatus, LicenceType, SortKeys };
export type {
  ITransportCreate,
  ITransport,
  ITransportUpdate,
  ITransportGetWhere,
};
