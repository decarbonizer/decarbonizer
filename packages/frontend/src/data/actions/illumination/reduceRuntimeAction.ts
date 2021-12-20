import { AiOutlineFieldTime } from 'react-icons/ai';
import { Action } from '../action';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { IlluminationSurveyAnswerValue } from '../../surveys/illumination/illuminationSurveyAnswerValue';

export const reduceRuntimeAction: Action<IlluminationSurveyAnswerValue> = {
  id: 'reduceRuntime',
  name: 'Reduce Runtime',
  icon: AiOutlineFieldTime,
  description: 'You can reduce your CO2 footprint and costs by reducing the runtime of your lights.',
  forSurvey: 'illumination',
  getSchema: () => ({
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
  }),
  detailsSchema: {
    pages: [
      {
        elements: [
          chooseTimePeriodElement,
          choosePriorityElement,
          createChooseSurveyAnswerElement('currentRealEstateIlluminationSurveyAnswers'),
        ],
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
