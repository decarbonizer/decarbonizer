import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { SurveyRepository } from './survey.repository';
import { Survey } from './survey.schema';

@Injectable()
export class SurveySeeder extends DefaultDbSeeder<Survey> {
  constructor(SurveyRepository: SurveyRepository) {
    super(SurveyRepository);
  }

  protected override getSeed(): Array<Survey> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        identifier: 'illumination',
        name: 'Illumination',
        imageUrl:
          'https://images.unsplash.com/photo-1516715651727-95fa73e9799c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&w=640&q=426',
        description: 'Collect data about how the lamps in your real estate contribute to your CO2 footprint.',
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
              name: 'Illumination Usage',
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
              name: 'Illumination Duration',
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
        },
      },
    ];
  }
}
