/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormSchema } from '../../form-engine/formSchema';
import { choosePriorityElement } from './shared/choosePriorityElement';
import { chooseTimePeriodElement } from './shared/chooseTimePeriodElement';

const schemaLED: FormSchema = {
  pages: [
    {
      elements: [chooseTimePeriodElement, choosePriorityElement],
    },
  ],
};

const schemaRunTime: FormSchema = {
  pages: [
    {
      elements: [
        chooseTimePeriodElement,
        choosePriorityElement,
        {
          id: 'inOut',
          required: false,
          label: 'Where, Inside or Outside?',
          type: 'single-choice-select',
          options: [{ value: 'inside' }, { value: 'outside' }],
        },
        { id: 'numberOfHours', required: false, label: 'By how many hours?', type: 'number' },
      ],
    },
  ],
};

const schemaBrightnessSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        choosePriorityElement,
      ],
    },
  ],
};

const schemaMotionSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        choosePriorityElement,
        { id: 'numberOfHours', required: false, label: 'How long the illuminant should be active?', type: 'number' },
      ],
    },
  ],
};

const schemaTimeSensor: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        choosePriorityElement,
        {
          id: 'chooseTimeOn',
          required: false,
          label: 'When the illuminants should be switched on?',
          type: 'date-time',
        },
        {
          id: 'chooseTimeOff',
          required: false,
          label: 'When the illuminants should be switched off?',
          type: 'date-time',
        },
      ],
    },
  ],
};

const schemaSwitches: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
        choosePriorityElement,
      ],
    },
  ],
};
