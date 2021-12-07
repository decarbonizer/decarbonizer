import { MultiChoiceFormSchemaElement } from '../../../form-engine/formSchema';

export const chooseSurveyAnswerElement: MultiChoiceFormSchemaElement = {
  id: 'surveyAnswers',
  required: false,
  label: '📩 Apply action to these surveys',
  type: 'multi-choice',
  options: 'currentRealEstateSurveyAnswers',
  validation: [
    {
      message: 'You must select at least one option.',
      satisfy: 'all',
      conditions: [
        {
          property: 'surveyAnswers.length',
          op: 'gt',
          value: 0,
        },
      ],
    },
  ],
};

export interface ChooseSurveyAnswerElementAnswerValue {
  surveyAnswers: Array<string>;
}
