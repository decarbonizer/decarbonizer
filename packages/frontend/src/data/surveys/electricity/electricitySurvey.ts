import { Survey } from '../survey';

export const electricitySurvey: Survey = {
  id: 'electricity',
  name: 'Electricity',
  imageUrl:
    'https://images.unsplash.com/photo-1610056494071-9373f12bf769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
  description: 'Collect data about your energy choices in your real estate.',
  schema: {
    pages: [
      {
        name: 'Location',
        elements: [
          {
            id: 'realEstateName',
            required: true,
            type: 'string',
            label: 'Where is the electricity used?',
            helperText:
              'The location or room for which you want to record illumination data.\nExamples: Main Hall, CEO Office, Storage Room 1, Hangar, Living Room, ...',
          },
          {
            id: 'isInitialSurvey',
            required: true,
            type: 'boolean',
            label: 'Is this your first survey for this location/room?',
            trueText: 'Yes',
            falseText: 'No',
            helperText: 'All initial surveys will be considered for the start of your net-zero calculation.',
          },
        ],
      },
      {
        name: 'Electricity supply',
        elements: [
          {
            id: 'energyForm',
            required: true,
            type: 'single-choice',
            label: 'Which energy form do you use?',
            options: 'energyForms',
          },
          {
            id: 'avgConsumptionPerYear',
            required: true,
            type: 'number-unit',
            label: 'How much energy do you consume on average per year?',
            units: 'energy',
            normedUnit: 'kWh',
            normedMin: 0,
          },
        ],
      },
    ],
  },
};
