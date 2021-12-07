import { Action } from '../action';
import { BsThermometerSnow } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'heating' + create heating survey, options: 'heating'
export const heatLessAction: Action = {
  id: 'heatLess',
  name: 'Heat less',
  icon: BsThermometerSnow,
  description:
    'As a rule of thumb, for every less degree of room temperature, approx. 6% of your heating energy is saved.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newRoomTemperature',
            type: 'number',
            required: false,
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
