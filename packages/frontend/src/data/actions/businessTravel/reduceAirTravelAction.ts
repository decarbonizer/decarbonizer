import { Action } from '../action';
import { RiComputerLine } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'businessTravel' + create heating survey, options: 'businessTravel'
export const reduceAirTravelAction: Action = {
  id: 'reduceAirTravel',
  name: 'Reduce air travel',
  icon: RiComputerLine,
  description: 'Online conferences and working remotely instead of air traveling may reduce your carbon footprint.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'lessLongTraveling',
            type: 'number',
            label: 'How many long-distance flights (>4000 km) can you save next year?',
            required: false,
          },
          {
            id: 'lessShortTraveling',
            type: 'number',
            label: 'How many short- and medium-haul flights (<4000 km) can you save next year?',
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
