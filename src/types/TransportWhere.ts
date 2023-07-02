import { TransportType } from 'src/db/schemas/Transport';
import { Where } from './Where';

export class TransportWhere extends Where {
  priceRange?: [number, number];
  maxSpeed?: number;
  color?: string;
  powerRange?: [number, number];
  type?: TransportType;
  licenceType?: TransportType;
}
