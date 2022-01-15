import { KnownActionId } from '../data/actions/action';
import { getSuggestionForSwitchToGreenEnergy } from './electricity/footprint';
import { ExternalCalculationData } from './externalData';
import { getSuggestionForSwitchToHeatPump } from './heating/footprint';
import { getSuggestionForChangeBulbs } from './illumination/footprint';

export function getSuggestion(externalCalculationData: ExternalCalculationData, actionId: KnownActionId) {
  switch (actionId) {
    case 'changeBulbs':
      return getSuggestionForChangeBulbs(externalCalculationData);
    case 'switchToHeatPump':
      return getSuggestionForSwitchToHeatPump(externalCalculationData);
    case 'switchToGreenEnergy':
      return getSuggestionForSwitchToGreenEnergy(externalCalculationData);
    default:
      break;
  }
}
