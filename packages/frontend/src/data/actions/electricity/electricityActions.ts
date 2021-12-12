import { ActionCategory } from '../action';
import { GiElectric } from 'react-icons/gi';
import { switchToGreenEnergy } from './switchToGreenEnergy';

export const electricityActionsCategory: ActionCategory = {
  id: 'electricity',
  name: 'Electricity',
  icon: GiElectric,
  actions: [switchToGreenEnergy],
};
