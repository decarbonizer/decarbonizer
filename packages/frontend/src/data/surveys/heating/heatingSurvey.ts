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
          {
            id: 'realEstateAreaInQm',
            required: true,
            type: 'number',
            min: 1,
            label: 'How big is the area for this location?',
            helperText: 'Please use square meters',
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
        name: 'Radiator',
        elements: [
          {
            id: 'radiatorKind',
            required: true,
            type: 'single-choice',
            label: 'How do you heat',
            options: 'heatingTypes',
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
