import { Survey } from '../survey';

export const itSurvey: Survey = {
  id: 'it',
  name: 'IT',
  imageUrl: 'https://cdn.pixabay.com/photo/2017/07/06/03/00/electrical-2476782_1280.jpg',
  description: 'Collect data about how your IT equipment contributes to your CO₂ footprint.',
  schema: {
    pages: [
      {
        name: 'IT',
        elements: [
          {
            id: 'realEstateName',
            required: true,
            type: 'string',
            label: 'Where are the servers located?',
            helperText:
              'The location or data center for which you want to record IT data.\nExamples: Server Room, Data Center 1, ...',
          },
          {
            id: 'isInitialSurvey',
            required: true,
            type: 'boolean',
            label: 'Is this your first survey regarding IT?',
            trueText: 'Yes',
            falseText: 'No',
            helperText: 'All initial surveys will be considered for the start of your net-zero calculation.',
          },
          {
            id: 'dataCenterEnergyForm',
            required: true,
            type: 'single-choice',
            label: 'Which energy form do you use for your data center?',
            options: 'energyForms',
          },
          {
            id: 'dataCenterTemperature',
            required: true,
            type: 'number-unit',
            label: 'What is the temperature of your data center?',
            units: 'temperature',
            normedUnit: 'C',
          },
          {
            id: 'gpuServerCount',
            required: true,
            type: 'number',
            label: 'How many GPU Servers are used?',
            min: 1,
          },
          {
            id: 'dataCenterConsumption',
            required: true,
            type: 'number-unit',
            label: 'How much energy does your data center consume on average per year?',
            units: 'energy',
            normedUnit: 'kWh',
            normedMin: 0,
          },
        ],
      },
    ],
  },
};
