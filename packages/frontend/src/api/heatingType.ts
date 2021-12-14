import { ApiObject } from './apiObject';

export interface HeatingType extends ApiObject {
  name: string;
  energyForm: string;
  productionKwh: number;
  consumptionKwh: number;
  installationCostInEuro: number;
}
