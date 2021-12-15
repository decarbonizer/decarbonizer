import { Action } from '../action';
import { BsThermometerSun } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';
import { HeatingSurveyAnswerValue } from '../../surveys/heating/heatingSurveyAnswerValue';

export const integrateSmartRadiatorThermostats: Action<HeatingSurveyAnswerValue> = {
  id: 'integrateSmartRadiatorThermostats',
  name: 'Smart thermostats',
  icon: BsThermometerSun,
  description: 'Smart radiator thermostats heat your office efficiently and climate-friendly.',
  forSurvey: 'heating',
  getSchema: (survey) => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newSmartTemperature',
              type: 'boolean-checkbox',
              label: 'Integrate smart radiator thermostats',
              defaultValue: survey?.value.smartThermostats,
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
