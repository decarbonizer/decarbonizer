import { Action } from '../action';
import { GiGreenPower } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { ElectricitySurveyAnswerValue } from '../../surveys/electricity/electricitySurveyAnswerValue';

export const switchToGreenEnergy: Action<ElectricitySurveyAnswerValue> = {
  id: 'switchToGreenEnergy',
  name: 'Switch to green energy',
  icon: GiGreenPower,
  description: 'Switching to another energy form may have a positive effect on your carbon footprint.',
  forSurvey: 'electricity',
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newEnergyForm',
              type: 'single-choice',
              required: false,
              options: 'energyForms',
            },
          ],
        },
      ],
    };
  },
  detailsSchema: {
    pages: [
      {
        elements: [chooseTimePeriodElement, choosePriorityElement, chooseSurveyAnswerElement],
      },
    ],
  },
};

export interface SwitchToGreenEnergyActionAnswerValue {
  newEnergyForm: string;
}

export interface SwitchToGreenEnergyDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
