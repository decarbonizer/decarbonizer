import { Action } from '../action';
import { BsThermometerHigh } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'businessTravel' + create heating survey, options: 'businessTravel'
export const increaseDataCenterTemperature: Action = {
  id: 'increaseDataCenterTemperature',
  name: 'Increase data center temperature',
  icon: BsThermometerHigh,
  description: 'Approx. 23°C is the optimum temperature to save energy without risking overheating.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newDataCenterTemperature',
            label: 'Test',
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
