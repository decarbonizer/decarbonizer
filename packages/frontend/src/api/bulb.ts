import { ApiObject } from './apiObject';

export interface Bulb extends ApiObject {
  name: string;
  watt: number;
  productionKwh: number;
  costInEuro: number;
  lifetimeInHours: number;
}
