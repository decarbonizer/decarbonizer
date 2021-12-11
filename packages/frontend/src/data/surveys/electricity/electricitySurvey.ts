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
            label: 'Where is the heating system used?',
            helperText:
              'The location or room for which you want to record illumination data.\nExamples: Main Hall, CEO Office, Storage Room 1, Hangar, Living Room, ...',
          },
        ],
      },
      {
        name: 'Electricity supply',
        elements: [
          {
            id: 'electricityKind',
            required: true,
            type: 'single-choice',
            label: 'What energy supplier do you have?',
            options: [
              { display: 'Wind power', value: 'windPower' },
              { display: 'Hydropower', value: 'hydroPower' },
              { display: 'Solar power (concentrated)', value: 'conSolarPower' },
              { display: 'Solar photovoltaic', value: 'solarPV' },
              { display: 'Geothermal', value: 'geothermal' },
              { display: 'Biomass', value: 'biomass' },
              { display: 'Gas', value: 'gas' },
              { display: 'Coal', value: 'coal' },
            ],
          },
        ],
      },
    ],
  },
};
