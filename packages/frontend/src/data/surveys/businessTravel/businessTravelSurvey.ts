import { Survey } from '../survey';

export const businessTravelSurvey: Survey = {
  id: 'businessTravel',
  name: 'Business Travel',
  imageUrl: 'https://cdn.pixabay.com/photo/2020/05/23/04/11/transport-5207942_1280.jpg',
  description: 'Collect data about how business travel contributes to your CO₂ footprint.',
  schema: {
    pages: [
      {
        name: 'Business Travel',
        elements: [
          {
            id: 'employeeName',
            required: true,
            type: 'string',
            label: 'Who fills out current survey?',
            helperText: 'Please specify the name.',
          },
          {
            id: 'isInitialSurvey',
            required: true,
            type: 'boolean',
            label: 'Is this your first survey regarding business travel?',
            trueText: 'Yes',
            falseText: 'No',
            helperText: 'All initial surveys will be considered for the start of your net-zero calculation.',
          },
          {
            id: 'longTraveling',
            required: true,
            type: 'number-unit',
            label: 'How far do you travel via long-haul flights (>4000 km) on average per year?',
            units: 'length',
            normedUnit: 'km',
            normedMin: 0,
          },
          {
            id: 'shortTraveling',
            required: true,
            type: 'number-unit',
            label: 'How far do you travel via short- and medium-haul flights (<4000 km) on average per year?',
            units: 'length',
            normedUnit: 'km',
            normedMin: 0,
          },
        ],
      },
    ],
  },
};
