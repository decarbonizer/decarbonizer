import { AiOutlineBulb } from 'react-icons/ai';
import { Action } from '../action';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { IlluminationSurveyAnswerValue } from '../../surveys/illumination/illuminationSurveyAnswerValue';

export const changeBulbsAction: Action<IlluminationSurveyAnswerValue> = {
  id: 'changeBulbs',
  name: 'Change Bulbs',
  icon: AiOutlineBulb,
  description:
    'Upgrading the light bulbs in your office may have a positive effect on your carbon footprint. LEDs tend to produce less footprint',
  forSurvey: 'illumination',
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newBulb',
              type: 'single-choice',
              required: false,
              options: 'bulbs',
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

export interface ChangeBulbsActionAnswerValue {
  newBulb: string;
}

export interface ChangeBulbsActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
