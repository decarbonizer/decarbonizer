import { Action } from '../action';
import { RiComputerLine } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import {
  createChooseSurveyAnswerElement,
  ChooseSurveyAnswerElementAnswerValue,
} from '../shared/chooseSurveyAnswerElement';

export const reduceAirTravelAction: Action = {
  id: 'reduceAirTravel',
  name: 'Reduce air travel',
  icon: RiComputerLine,
  description: 'Online conferences and working remotely instead of air traveling may reduce your carbon footprint.',
  forSurvey: 'businessTravel',
  suggestionExists: false,
  getSchema: () => {
    return {
      pages: [
        {
          elements: [
            {
              id: 'lessLongTraveling',
              type: 'number-unit',
              units: 'length',
              normedUnit: 'km',
              normedMin: 0,
              label: 'How much travel via long-distance flights (>4000 km) can you save?',
              required: false,
            },
            {
              id: 'lessShortTraveling',
              type: 'number-unit',
              units: 'length',
              normedUnit: 'km',
              normedMin: 0,
              label: 'How much travel via short- and medium-haul flights (<4000 km) can you save?',
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
          createChooseSurveyAnswerElement('currentRealEstateBusinessTravelSurveyAnswers'),
        ],
      },
    ],
  },
};
export interface ReduceAirTravelActionAnswerValue {
  lessLongTraveling: number;
  lessShortTraveling: number;
}

export interface ReduceAirTravelActionDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
