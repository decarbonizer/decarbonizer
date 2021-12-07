import { Action } from '../action';
import { BsThermometerSun } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'heating' + create heating survey, options: 'heating'
export const integrateSmartRadiatorThermostats: Action = {
  id: 'integrateSmartRadiatorThermostats',
  name: 'Integrate smart thermostats',
  icon: BsThermometerSun,
  description: 'Smart radiator thermostats heat your office efficiently and climate-friendly.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newSmartTemperature',
            type: 'boolean-checkbox',
            label: 'Integrate smart radiator thermostats',
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
