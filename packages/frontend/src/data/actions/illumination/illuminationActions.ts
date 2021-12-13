import { GiCeilingLight } from 'react-icons/gi';
import { IlluminationSurveyAnswerValue } from '../../surveys/illumination/illuminationSurveyAnswerValue';
import { ActionCategory } from '../action';
import { changeBulbsAction } from './changeBulbsAction';
import { reduceRuntimeAction } from './reduceRuntimeAction';

export const illuminationActionsCategory: ActionCategory<IlluminationSurveyAnswerValue> = {
  id: 'illumination',
  name: 'Illumination',
  icon: GiCeilingLight,
  actions: [changeBulbsAction, reduceRuntimeAction],
};
