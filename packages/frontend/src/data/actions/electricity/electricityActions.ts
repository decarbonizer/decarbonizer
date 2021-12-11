import { ActionCategory } from '../action';
import { GiElectric } from 'react-icons/gi';
import { switchToGreenEnergy } from './switchToGreenEnergy';

export const electricityActionsCategory: ActionCategory = {
  name: 'Electricity',
  icon: GiElectric,
  actions: [switchToGreenEnergy],
};
