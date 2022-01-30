import { businessTravelCoreCalculations } from './businessTravelCoreCalculations';
import { electricityCoreCalculations } from './electricityCoreCalculations';
import { heatingCoreCalculations } from './heatingCoreCalculations';
import { illuminationCoreCalculations } from './illuminationCoreCalculations';
import { itCoreCalculations } from './itCoreCalculations';

export const allCategoryCoreCalculations = [
  businessTravelCoreCalculations,
  electricityCoreCalculations,
  heatingCoreCalculations,
  illuminationCoreCalculations,
  itCoreCalculations,
] as const;

export const categoryCoreCalculationsMap = {
  electricity: electricityCoreCalculations,
  illumination: illuminationCoreCalculations,
  heating: heatingCoreCalculations,
  businessTravel: businessTravelCoreCalculations,
  it: itCoreCalculations,
};

export type KnownCategoryCoreCalculationsId = keyof typeof categoryCoreCalculationsMap;
