import { KnownActionId } from '../data/actions/action';
import { getSuggestionForSwitchToGreenEnergyCost } from './electricity/cost';
import { getSuggestionForSwitchToGreenEnergyFootprint } from './electricity/footprint';
import { ExternalCalculationData } from '../calculations/useExternalCalculationData';
import { getSuggestionForSwitchToHeatPumpCost } from './heating/cost';
import { getSuggestionForSwitchToHeatPumpFootprint } from './heating/footprint';
import { getSuggestionForChangeBulbsCost } from './illumination/electricityCost';
import { getSuggestionForChangeBulbsFootprint } from './illumination/footprint';

//get action that reduces co2 the most
export function getSuggestionForFootprint(externalCalculationData: ExternalCalculationData, actionId: KnownActionId) {
  switch (actionId) {
    case 'changeBulbs':
      return getSuggestionForChangeBulbsFootprint(externalCalculationData);
    case 'switchToHeatPump':
      return getSuggestionForSwitchToHeatPumpFootprint(externalCalculationData);
    case 'switchToGreenEnergy':
      return getSuggestionForSwitchToGreenEnergyFootprint(externalCalculationData);
    default:
      break;
  }
}
//get action that reduces cost the most
export function getSuggestionForCost(externalCalculationData: ExternalCalculationData, actionId: KnownActionId) {
  switch (actionId) {
    case 'changeBulbs':
      return getSuggestionForChangeBulbsCost(externalCalculationData);
    case 'switchToHeatPump':
      return getSuggestionForSwitchToHeatPumpCost(externalCalculationData);
    case 'switchToGreenEnergy':
      return getSuggestionForSwitchToGreenEnergyCost(externalCalculationData);
    default:
      break;
  }
}
