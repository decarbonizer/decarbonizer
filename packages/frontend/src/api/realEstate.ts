import { ApiObject, ApiObjectUpdate } from './apiObject';

export interface RealEstate extends ApiObject {
  cityName: string;
  description?: string;
  image?: string;
  employees: number;
  area: number;
}

export interface RealEstateUpdate extends ApiObjectUpdate {
  cityName?: string;
  description?: string;
  image?: string;
  employees?: number;
  area?: number;
}
