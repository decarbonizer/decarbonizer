import { ActionCategory } from '../action';
import { GiHeatHaze } from 'react-icons/gi';
import { switchToHeatPumpAction } from './switchToHeatPumpAction';
import { integrateSmartRadiatorThermostats } from './integrateSmartRadiatorThermostats';
import { HeatingSurveyAnswerValue } from '../../surveys/heating/heatingSurveyAnswerValue';

export const heatingActionsCategory: ActionCategory<HeatingSurveyAnswerValue> = {
  id: 'heating',
  name: 'Heating',
  icon: GiHeatHaze,
  actions: [switchToHeatPumpAction, integrateSmartRadiatorThermostats], //heatLessAction,
};
