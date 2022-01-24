import { Action } from '../action';
import { BsThermometerHigh } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'businessTravel' + create heating survey, options: 'businessTravel'
export const increaseDataCenterTemperature: Action = {
  id: 'increaseDataCenterTemperature',
  name: 'Increase data center temperature',
  icon: BsThermometerHigh,
  description: 'Approx. 23°C is the optimum temperature to save energy without risking overheating.',
  forSurvey: 'illumination',
  suggestionExists: false,
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newDataCenterTemperature',
              label: 'Which temperature do you want to reach in your data center?',
              type: 'number-unit',
              units: 'temperature',
              normedUnit: 'C',
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
          createChooseSurveyAnswerElement('currentRealEstateElectricitySurveyAnswers'),
        ],
      },
    ],
  },
};

export interface IncreaseDataCenterTemperatureActionAnswerValue {
  newDataCenterTemperature: number;
}

export interface IncreaseDataCenterTemperatureActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
