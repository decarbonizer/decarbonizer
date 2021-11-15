import { FormSchema } from '../../form-engine/formSchema';

export const energySurvey: FormSchema = {
  pages: [
    {
      elements: [
        {
          id: 'realEstateName',
          required: true,
          type: 'string',
          label: 'Where is the illumination used?',
        },
      ],
    },
    {
      elements: [
        {
          id: 'lampCount',
          required: true,
          type: 'number',
          label: 'How many lamps are used?',
        },
      ],
    },
    {
      elements: [
        {
          id: 'bulbType',
          required: true,
          type: 'single-choice-select',
          label: 'What kind of illuminant is used?',
          options: 'bulbs',
        },
      ],
    },
    {
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
      elements: [
        {
          id: 'illuminationTriggerMode',
          required: true,
          type: 'single-choice',
          label: 'How is the illumination triggered?',
          options: [
            {
              value: 'automatically',
              display: 'Automatically',
            },
            {
              value: 'manually',
              display: 'Manually',
            },
          ],
        },
        {
          id: 'illuminationTriggerEvent',
          required: true,
          type: 'single-choice',
          label: 'What is the triggering event?',
          options: [
            {
              value: 'brightness',
              display: 'Brightness controlled',
            },
            {
              value: 'timeTriggered',
              display: 'Time-triggered',
            },
            {
              value: 'motionTriggered',
              display: 'Motion-triggered',
            },
          ],
          rules: [
            {
              effect: 'hide',
              satisfy: 'any',
              conditions: [
                {
                  property: 'illuminationTriggerMode',
                  op: 'absent',
                },
                {
                  property: 'illuminationTriggerMode',
                  op: 'eq',
                  value: 'manually',
                },
              ],
            },
          ],
        },
        {
          id: 'illuminationSwitchOffMode',
          required: true,
          type: 'single-choice',
          label: 'How is it switched off?',
          options: [
            {
              value: 'automaticTimeout',
              display: 'Timed out automatically',
            },
            {
              value: 'manuallySwitchedOff',
              display: 'Switched off manually',
            },
          ],
          rules: [
            {
              effect: 'hide',
              satisfy: 'any',
              conditions: [
                {
                  property: 'illuminationTriggerMode',
                  op: 'absent',
                },
                {
                  property: 'illuminationTriggerMode',
                  op: 'eq',
                  value: 'automatically',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          id: 'illuminationSwitchOnMode',
          required: true,
          type: 'single-choice',
          label: 'When is the illumination switched on?',
          options: [
            {
              value: 'always',
              display: 'Always',
            },
            {
              value: 'onDemand',
              display: 'On demand',
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          id: 'avgIlluminationPerDay',
          required: true,
          type: 'number-unit',
          label: 'How long is the location illuminated on average per day?',
          units: 'time',
          normedUnit: 'd',
          defaultSelectedUnit: 'h',
          normedMin: 0,
          normedMax: 1,
        },
      ],
    },
  ],
};
