import { GiCeilingLight } from 'react-icons/gi';
import { ActionCategory } from '../action';
import { changeBulbsAction } from './changeBulbsAction';
import { reduceRuntimeAction } from './reduceRuntimeAction';

export const illuminationActionsCategory: ActionCategory = {
  id: 'illumination',
  name: 'Illumination',
  icon: GiCeilingLight,
  actions: [changeBulbsAction, reduceRuntimeAction],
};
