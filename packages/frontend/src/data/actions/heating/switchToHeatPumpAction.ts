import { Action } from '../action';
import { AiOutlineBoxPlot } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';
import { HeatingSurveyAnswerValue } from '../../surveys/heating/heatingSurveyAnswerValue';

export const switchToHeatPumpAction: Action<HeatingSurveyAnswerValue> = {
  id: 'switchToHeatPump',
  name: 'Switch to heat pump',
  icon: AiOutlineBoxPlot,
  description: 'A heat pump does not use fossil fuels, it actively contributes to the reduction of your CO₂ emissions',
  forSurvey: 'heating',
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newHeatPump',
              type: 'single-choice',
              required: false,
              options: 'heatingTypes',
            },
          ],
        },
      ],
    };
  },
  detailsSchema: {
    pages: [
      {
        elements: [
          chooseTimePeriodElement,
          choosePriorityElement,
          createChooseSurveyAnswerElement('currentRealEstateHeatingSurveyAnswers'),
        ],
      },
    ],
  },
};

export interface SwitchToHeatPumpActionAnswerValue {
  newHeatPump: string;
}

export interface SwitchToHeatPumpActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
