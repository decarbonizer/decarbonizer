import { ApiObject } from "./apiObject";

export interface RealEstate extends ApiObject {
    cityName: string;
    description?: string;
    employees: number;
    area: number;
  }