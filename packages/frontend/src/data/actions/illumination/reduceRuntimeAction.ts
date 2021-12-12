import { AiOutlineFieldTime } from 'react-icons/ai';
import { Action } from '../action';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';

export const reduceRuntimeAction: Action = {
  id: 'reduceRuntime',
  name: 'Reduce Runtime',
  icon: AiOutlineFieldTime,
  description: 'You can reduce your CO2 footprint and costs by reducing the runtime of your lights.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'dailyRuntimeReductionInDays',
            type: 'number-unit',
            required: false,
            units: 'time',
            normedUnit: 'd',
            label: 'Reduce daily runtime by:',
            defaultSelectedUnit: 'min',
            normedMin: 0,
            normedMax: 1,
          },
          {
            id: 'yearlyRuntimeReductionInDays',
            type: 'number',
            required: false,
            label: 'Reduce yearly runtime by days:',
            min: 0,
            max: 365,
          },
        ],
      },
    ],
  },
  detailsSchema: {
    pages: [
      {
        elements: [chooseTimePeriodElement, choosePriorityElement, chooseSurveyAnswerElement],
      },
    ],
  },
};

export interface ReduceRuntimeActionAnswerValue {
  dailyRuntimeReductionInDays?: number;
  yearlyRuntimeReductionInDays?: number;
}

export interface ReduceRuntimeActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
