import { Survey } from '../survey';

export const heatingSurvey: Survey = {
  id: 'heating',
  name: 'Heating',
  imageUrl:
    'https://images.unsplash.com/photo-1523495909838-79c67b15be34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  description: 'Collect data about how your heating habits in your real estate contribute to your CO₂ footprint.',
  schema: {
    pages: [
      {
        name: 'Location',
        elements: [
          {
            id: 'realEstateName',
            required: true,
            type: 'string',
            label: 'Where is the heating system used?',
            helperText:
              'The location or room for which you want to record illumination data.\nExamples: Main Hall, CEO Office, Storage Room 1, Hangar, Living Room, ...',
          },
        ],
      },
      {
        name: 'Radiator',
        elements: [
          {
            id: 'radiatorKind',
            required: true,
            type: 'single-choice',
            label: 'How do you heat',
            options: [
              {
                value: '00000000-0000-0000-0000-000000000000',
                display: 'Solar thermal',
              },
              {
                value: '00000000-0000-0000-0000-000000000001',
                display: 'Ground source heat pump',
              },
              {
                value: '00000000-0000-0000-0000-000000000002',
                display: 'Air source heat pump',
              },
              {
                value: '00000000-0000-0000-0000-000000000003',
                display: 'Direct electric heating',
              },
              {
                value: '00000000-0000-0000-0000-000000000004',
                display: 'Gas boiler',
              },
              {
                value: '00000000-0000-0000-0000-000000000005',
                display: 'Oil boiler',
              },
            ],
          },
        ],
      },
      {
        name: 'Temperature',
        elements: [
          {
            id: 'roomTemperature',
            required: true,
            type: 'number',
            label: 'Which temperature do you have in your office?',
          },
          {
            id: 'smartThermostats',
            required: true,
            type: 'boolean',
            trueText: 'Yes',
            falseText: 'No',
            label: 'Do you use a smart radiator thermostat?',
          },
        ],
      },
      {
        name: 'Total heating',
        elements: [
          {
            id: 'avgHeatingPerYear',
            required: true,
            type: 'number',
            label: 'How many days per year is the location heated on average?',
            min: 0,
            max: 366,
          },
        ],
      },
    ],
  },
};
