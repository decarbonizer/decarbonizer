import { Action } from '../action';
import { BsThermometerSun } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';

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
export interface IntegrateSmartRadiatorThermostatsActionAnswerValue {
  newSmartTemperature: boolean;
}

export interface IntegrateSmartRadiatorThermostatsActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
