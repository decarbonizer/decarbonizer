import { AiOutlineFieldTime } from 'react-icons/ai';
import { Action } from '../action';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';

export const changeRuntimeAction: Action = {
  id: 'changeRuntime',
  name: 'Change Runtime',
  icon: AiOutlineFieldTime,
  description: 'Reduce the runtime of the light in your office may have a positive effect on your carbon footprint.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newRuntime',
            type: 'number-unit',
            required: false,
            units: 'time',
            normedUnit: 'd',
            placeholder: 'New runtime',
            defaultSelectedUnit: 'h',
            normedMin: 0,
            normedMax: 1,
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

export interface ChangeRuntimeActionAnswerValue {
  newRuntime: number;
}

export interface ChangeRuntimeActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
