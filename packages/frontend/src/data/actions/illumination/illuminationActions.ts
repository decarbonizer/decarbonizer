import { GiCeilingLight } from 'react-icons/gi';
import { ActionCategory } from '../action';
import { changeBulbsAction } from './changeBulbsAction';
import { changeRuntimeAction } from './changeRuntimeAction';
import { IlluminationSurveyAnswerValue } from '../../surveys/illumination/illuminationSurveyAnswerValue';

export const illuminationActionsCategory: ActionCategory<IlluminationSurveyAnswerValue> = {
  id: 'illumination',
  name: 'Illumination',
  icon: GiCeilingLight,
  actions: [changeBulbsAction, changeRuntimeAction],
};
