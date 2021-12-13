import { Survey } from '../survey';

export const illuminationSurvey: Survey = {
  id: 'illumination',
  name: 'Illumination',
  imageUrl:
    'https://images.unsplash.com/photo-1516715651727-95fa73e9799c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&w=640&q=426',
  description: 'Collect data about how the lamps in your real estate contribute to your CO₂ footprint.',
  schema: {
    pages: [
      {
        name: 'Location',
        elements: [
          {
            id: 'realEstateName',
            required: true,
            type: 'string',
            label: 'Where is the illumination used?',
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
        name: 'Lamps',
        elements: [
          {
            id: 'lampCount',
            required: true,
            type: 'number',
            label: 'How many lamps are used?',
            min: 0,
          },
          {
            id: 'bulbType',
            required: true,
            type: 'single-choice-select',
            label: 'What kind of lamp is used?',
            options: 'bulbs',
          },
        ],
      },
      {
        name: 'Lamp Exchangability',
        elements: [
          {
            id: 'isIlluminantExchangeable',
            required: true,
            type: 'boolean',
            label: 'Can the illuminant be exchanged?',
            trueText: 'Yes',
            falseText: 'No',
          },
        ],
      },
      {
        name: 'Illumination Triggers',
        elements: [
          {
            id: 'switchOnMode',
            required: true,
            type: 'single-choice',
            label: 'When is the illumination switched on?',
            options: [
              {
                value: 'always',
                display: 'Always',
              },
              {
                value: 'manually',
                display: 'Manually',
              },
              {
                value: 'motionTriggered',
                display: 'Motion Triggered',
              },
              {
                value: 'timeTriggered',
                display: 'Time Triggered',
              },
              {
                value: 'brightnessTriggered',
                display: 'Brightness Triggered',
              },
            ],
          },

          // switchOnMode === 'motionTriggered':
          {
            id: 'motionTriggerTimeout',
            required: true,
            type: 'number-unit',
            label: 'How long until the motion trigger times out?',
            normedUnit: 'min',
            units: 'timeMinutes',
            normedMax: 60,
            normedMin: 0,
            rules: [
              {
                effect: 'hide',
                satisfy: 'any',
                conditions: [
                  {
                    property: 'switchOnMode',
                    op: 'absent',
                  },
                  {
                    property: 'switchOnMode',
                    op: 'neq',
                    value: 'motionTriggered',
                  },
                ],
              },
            ],
          },
          {
            id: 'motionTriggerAvgTriggersPerDay',
            required: true,
            type: 'number',
            label: 'How often is the motion sensor triggered per day (on average)?',
            min: 0,
            rules: [
              {
                effect: 'hide',
                satisfy: 'any',
                conditions: [
                  {
                    property: 'switchOnMode',
                    op: 'absent',
                  },
                  {
                    property: 'switchOnMode',
                    op: 'neq',
                    value: 'motionTriggered',
                  },
                ],
              },
            ],
          },

          {
            id: 'avgRuntimePerDay',
            required: true,
            type: 'number-unit',
            label: 'How long is the location illuminated on average per day?',
            units: 'time',
            normedUnit: 'd',
            defaultSelectedUnit: 'h',
            normedMin: 0,
            normedMax: 1,
            rules: [
              {
                effect: 'hide',
                satisfy: 'any',
                conditions: [
                  {
                    property: 'switchOnMode',
                    op: 'absent',
                  },
                  {
                    property: 'switchOnMode',
                    op: 'eq',
                    value: 'always',
                  },
                  {
                    property: 'switchOnMode',
                    op: 'eq',
                    value: 'motionTriggered',
                  },
                ],
              },
            ],
          },
          {
            id: 'avgRuntimePerYear',
            required: false,
            type: 'number',
            label: 'How many days per year is the location illuminated (on average)?',
            helperText: 'If not answered, 365 days/year is assumed.',
            min: 0,
            max: 365,
            rules: [
              {
                effect: 'hide',
                satisfy: 'any',
                conditions: [
                  {
                    property: 'switchOnMode',
                    op: 'absent',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
