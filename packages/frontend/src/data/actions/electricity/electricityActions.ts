import { ActionCategory } from '../action';
import { GiElectric } from 'react-icons/gi';
import { switchToGreenEnergy } from './switchToGreenEnergy';
import { ElectricitySurveyAnswerValue } from '../../surveys/electricity/electricitySurveyAnswerValue';

export const electricityActionsCategory: ActionCategory<ElectricitySurveyAnswerValue> = {
  id: 'electricity',
  name: 'Electricity',
  icon: GiElectric,
  actions: [switchToGreenEnergy],
};
