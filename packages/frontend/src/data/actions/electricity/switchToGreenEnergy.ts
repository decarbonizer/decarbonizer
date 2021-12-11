import { Action } from '../action';
import { GiGreenPower } from 'react-icons/all';
import { chooseTimePeriodElement, ChooseTimePeriodElementAnswerValue } from '../shared/chooseTimePeriodElement';
import { choosePriorityElement, ChoosePriorityElementAnswerValue } from '../shared/choosePriorityElement';
import { chooseSurveyAnswerElement, ChooseSurveyAnswerElementAnswerValue } from '../shared/chooseSurveyAnswerElement';

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
            options: [
              { display: 'Wind power', value: 'windPower' },
              { display: 'Hydropower', value: 'hydroPower' },
              { display: 'Solar power (concentrated)', value: 'conSolarPower' },
              { display: 'Solar photovoltaic', value: 'solarPV' },
              { display: 'Geothermal', value: 'geothermal' },
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

export interface SwitchToGreenEnergyActionAnswerValue {
  newEnergySource: 'windPower' | 'hydroPower' | 'conSolarPower' | 'roofSolarPower' | 'geothermal';
}

export interface SwitchToGreenEnergyDetailsAnswerValue
  extends ChoosePriorityElementAnswerValue,
    ChooseTimePeriodElementAnswerValue,
    ChooseSurveyAnswerElementAnswerValue {}
