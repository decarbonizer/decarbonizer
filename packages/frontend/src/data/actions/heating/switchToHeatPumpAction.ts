import { Action } from '../action';
import { AiOutlineBoxPlot } from 'react-icons/all';
import { chooseTimePeriodElement } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement } from '../shared/chooseSurveyAnswerElement';

//TODO: forSurvey 'heating' + create heating survey, options: 'heating'
export const switchToHeatPumpAction: Action = {
  id: 'switchToHeatPump',
  name: 'Switch to heat pump',
  icon: AiOutlineBoxPlot,
  description: 'A heat pump does not use fossil fuels, it actively contributes to the reduction of your CO₂ emissions',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newHeatPump',
            type: 'single-choice',
            required: false,
            options: [
              { display: 'Ground source heat pump', value: 'groundSourceHeatPump' },
              { display: 'Air source heat pump', value: 'airSourceHeatPump' },
              { display: 'Solar thermal', value: 'solarThermal' },
            ],
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
