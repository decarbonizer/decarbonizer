import { Action } from '../action';
import { GrCloudComputer } from 'react-icons/gr';
import { ItSurveyAnswerValue } from '../../surveys/it/itSurveyAnswerValue';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';

export const useSuperServer: Action<ItSurveyAnswerValue> = {
  id: 'useSuperServer',
  name: 'Change GPU Servers',
  icon: GrCloudComputer,
  description: 'Clound&Heat provides technology that uses produced heating from GPU Servers to heat rooms.',
  forSurvey: 'it',
  suggestionExists: false,
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'newServer',
              type: 'boolean-checkbox',
              label: 'Use Supermicro SuperServers 9029GP',
              defaultValue: false,
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
          createChooseSurveyAnswerElement('currentRealEstateItSurveyAnswers'),
        ],
      },
    ],
  },
};

export interface UseSuperServerActionAnswerValue {
  newServer: boolean;
}

export interface UseSuperServerActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
