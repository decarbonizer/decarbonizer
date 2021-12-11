import { ActionCategory } from '../action';
import { RiDatabaseLine } from 'react-icons/all';
import { increaseDataCenterTemperature } from './increaseDataCenterTemperature';

export const itActions: ActionCategory = {
  id: 'it',
  name: 'IT',
  icon: RiDatabaseLine,
  actions: [increaseDataCenterTemperature],
};
