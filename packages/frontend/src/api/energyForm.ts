import { ApiObject } from './apiObject';

export interface EnergyForm extends ApiObject {
  name: string;
  co2PerGramPerKwh: number;
  euroPerKwh: number;
}
