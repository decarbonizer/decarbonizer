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
  name: 'Change heating',
  icon: AiOutlineBoxPlot,
  description:
    'A heat pump does not use fossil fuels and a solar panel does not use electricity. They both actively contribute to the reduction of your CO₂ emissions.',
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
              options: [
                {
                  value: '00000000-0000-0000-0000-000000000000',
                  display: 'Solar panels',
                },
                {
                  value: '00000000-0000-0000-0000-000000000001',
                  display: 'Ground source heat pump',
                },
                {
                  value: '00000000-0000-0000-0000-000000000003',
                  display: 'Direct electric heating',
                },
                {
                  value: '00000000-0000-0000-0000-000000000004',
                  display: 'Gas boiler',
                },
                {
                  value: '00000000-0000-0000-0000-000000000005',
                  display: 'Oil boiler',
                },
              ],
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
