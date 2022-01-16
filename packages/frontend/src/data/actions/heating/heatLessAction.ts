import { Action } from '../action';
import { BsThermometerSnow } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';
import { HeatingSurveyAnswerValue } from '../../surveys/heating/heatingSurveyAnswerValue';

export const heatLessAction: Action<HeatingSurveyAnswerValue> = {
  id: 'heatLess',
  name: 'Heat less',
  icon: BsThermometerSnow,
  description:
    'As a rule of thumb, for every less degree of room temperature, approx. 6% of your heating energy is saved.',
  forSurvey: 'heating',
  suggestionExists: false,
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newRoomTemperature',
              label: 'Which temperature do you want to have in your office? (in C°)',
              type: 'number',
              required: false,
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

export interface HeatLessActionAnswerValue {
  newRoomTemperature: number;
}

export interface HeatLessActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
