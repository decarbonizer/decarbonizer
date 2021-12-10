import { ActionCategory } from '../action';
import { GiHeatHaze } from 'react-icons/gi';
import { switchToHeatPumpAction } from './switchToHeatPumpAction';
import { heatLessAction } from './heatLessAction';
import { integrateSmartRadiatorThermostats } from './integrateSmartRadiatorThermostats';

export const heatingActionsCategory: ActionCategory = {
  name: 'Heating',
  icon: GiHeatHaze,
  actions: [switchToHeatPumpAction, integrateSmartRadiatorThermostats, heatLessAction],
};
