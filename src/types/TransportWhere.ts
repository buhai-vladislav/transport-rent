import { LicenceType, TransportType } from '../db/schemas/Transport';
import { Where } from './Where';

export class TransportWhere extends Where {
  priceRange?: [number, number] | [string, string];
  maxSpeed?: number;
  color?: string;
  powerRange?: [number, number] | [string, string];
  type?: TransportType;
  licenceType?: LicenceType;
}
