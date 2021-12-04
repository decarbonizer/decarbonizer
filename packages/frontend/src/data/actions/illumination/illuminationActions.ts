import { GiCeilingLight } from 'react-icons/gi';
import { ActionCategory } from '../action';
import { changeBulbsAction } from './changeBulbsAction';

export const illuminationActionsCategory: ActionCategory = {
  name: 'Illumination',
  icon: GiCeilingLight,
  actions: [changeBulbsAction],
};
