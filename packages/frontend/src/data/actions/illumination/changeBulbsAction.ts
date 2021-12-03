import { AiOutlineBulb } from 'react-icons/ai';
import { Action } from '../action';

export const changeBulbsAction: Action = {
  id: 'changeBulbs',
  name: 'Change Bulbs',
  icon: AiOutlineBulb,
  description: 'Upgrading the light bulbs in your office may have a positive effect on your carbon footprint.',
  forSurvey: 'illumination',
  schema: {
    pages: [
      {
        elements: [
          {
            id: 'newBulb',
            type: 'single-choice',
            required: false,
            options: 'bulbs',
          },
        ],
      },
    ],
  },
};

export interface ChangeBulbsActionInlineAnswerValue {
  newBulb: string;
}
