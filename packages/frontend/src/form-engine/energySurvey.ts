import { FormSchema } from './formSchema';

export const energySurvey: FormSchema = {
  pages: [
    {
      elements: [
        {
          property: 'realEstateName',
          required: true,
          type: 'string',
          label: 'Where is the illumination used?',
        },
      ],
    },
    {
      elements: [
        {
          property: 'lampCount',
          required: true,
          type: 'number',
          label: 'How many lamps are used?',
        },
      ],
    },
    {
      elements: [
        {
          property: 'lampCount',
          required: true,
          type: 'number-slider',
          label: 'How many lamps are used?',
          min: 0,
          max: 150,
        },
      ],
    },
    {
      elements: [
        {
          property: 'bulbType',
          required: true,
          type: 'choice-select',
          label: 'What kind of illuminant is used?',
          options: 'bulbs',
        },
      ],
    },
    {
      elements: [
        {
          property: 'isIlluminantExchangeable',
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
          property: 'illuminationTriggerMode',
          required: true,
          type: 'choice',
          label: 'How is the illumunation triggered?',
          mode: 'single',
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
          property: 'illuminationTriggerEvent',
          required: true,
          type: 'choice',
          label: 'What is the triggering event?',
          mode: 'single',
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
        },
        {
          property: 'illuminationSwitchOffMode',
          required: true,
          type: 'choice',
          label: 'How is it switched off?',
          mode: 'single',
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
        },
      ],
    },
    {
      elements: [
        {
          property: 'illuminationSwitchOnMode',
          required: true,
          type: 'choice',
          label: 'When is the illumination switched on?',
          mode: 'single',
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
        // TODO: Q9, unit selection.
      ],
    },
  ],
};
