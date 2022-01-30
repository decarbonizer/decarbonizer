import { ApiObject } from './apiObject';

export interface BaseData extends ApiObject {
  realEstateId: string;
  salaryElectricianMaintenanceWorkerPerHour: number; // €/h
  timeToChangeOneBulb: number; // min/Stk
  salaryItMaintenanceWorkerPerHour: number; // €/h
  reductionFactorByUsingSuperServer: number;
  superServerCost: number;
  normalServerCost: number;
  serverMaintenanceTime: number; // h/stk
  serverLifeTime: number; //years
  footPrintServer: number; //Co2
  heatingKwHPerQm: number;
  shortTravelEF: number;
  longTravelEF: number;
  illuminationEF: number;
}
