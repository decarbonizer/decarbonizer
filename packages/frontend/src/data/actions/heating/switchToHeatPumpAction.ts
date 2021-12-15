import { Action } from '../action';
import { AiOutlineBoxPlot } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { HeatingSurveyAnswerValue } from '../../surveys/heating/heatingSurveyAnswerValue';

export const switchToHeatPumpAction: Action<HeatingSurveyAnswerValue> = {
  id: 'switchToHeatPump',
  name: 'Switch to heat pump',
  icon: AiOutlineBoxPlot,
  description: 'A heat pump does not use fossil fuels, it actively contributes to the reduction of your CO₂ emissions',
  forSurvey: 'heating',
  getSchema: (survey) => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newHeatPump',
              type: 'single-choice',
              required: false,
              defaultValue: survey?.value.radiatorKind,
              options: [
                { display: 'Ground source heat pump', value: '00000000-0000-0000-0000-000000000001' },
                { display: 'Air source heat pump', value: '00000000-0000-0000-0000-000000000002' },
                { display: 'Solar thermal', value: '00000000-0000-0000-0000-000000000000' },
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
        elements: [chooseTimePeriodElement, choosePriorityElement, chooseSurveyAnswerElement],
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
