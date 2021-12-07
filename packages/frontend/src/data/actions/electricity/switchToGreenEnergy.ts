import { Action } from '../action';
import { GiGreenPower } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'electricity' + create heating survey, options: 'electricity'
export const switchToGreenEnergy: Action = {
  id: 'switchToGreenEnergy',
  name: 'Switch to green energy',
  icon: GiGreenPower,
  description: 'Switching to another energy source may have a positive effect on your carbon footprint.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newEnergySource',
            type: 'single-choice',
            required: false,
            options: 'bulbs',
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
