import { GiCeilingLight } from 'react-icons/gi';
import { ActionCategory } from '../action';
import { changeBulbsAction } from './changeBulbsAction';
import { changeRuntimeAction } from './changeRuntimeAction';

export const illuminationActionsCategory: ActionCategory = {
  name: 'Illumination',
  icon: GiCeilingLight,
  actions: [changeBulbsAction, changeRuntimeAction],
};
