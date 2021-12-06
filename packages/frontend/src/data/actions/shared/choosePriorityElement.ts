import { SingleChoiceSelectFormSchemaElement } from '../../../form-engine/formSchema';

export const choosePriorityElement: SingleChoiceSelectFormSchemaElement = {
  id: 'priority',
  required: false,
  label: '📊 Choose priority',
  type: 'single-choice-select',
  options: [
    {
      value: 'high',
      display: 'High',
    },
    {
      value: 'medium',
      display: 'Medium',
    },
    {
      value: 'low',
      display: 'Low',
    },
  ],
};

export type Priority = 'low' | 'medium' | 'high';

export interface ChoosePriorityElementAnswerValue {
  priority?: Priority;
}
