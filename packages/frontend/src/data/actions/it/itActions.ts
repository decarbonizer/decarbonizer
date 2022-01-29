import { ActionCategory } from '../action';
import { RiDatabaseLine } from 'react-icons/all';
import { increaseDataCenterTemperature } from './increaseDataCenterTemperature';
import { useSuperServer } from './useSuperServer';

export const itActions: ActionCategory = {
  id: 'it',
  name: 'IT',
  icon: RiDatabaseLine,
  actions: [increaseDataCenterTemperature, useSuperServer],
};
