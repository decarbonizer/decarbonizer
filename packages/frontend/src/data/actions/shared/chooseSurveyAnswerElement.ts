import { MultiChoiceFormSchemaElement } from '../../../form-engine/formSchema';
import { useFormEngineChoiceOptionProviders } from '../../../form-engine/useFormEngineChoiceProviders';

export function createChooseSurveyAnswerElement(
  options: keyof ReturnType<typeof useFormEngineChoiceOptionProviders>['providers'] = 'currentRealEstateSurveyAnswers',
): MultiChoiceFormSchemaElement {
  return {
    id: 'surveyAnswers',
    required: false,
    label: '📩 Apply action to these surveys',
    type: 'multi-choice',
    options,
    validation: [
      {
        message: 'You must select at least one option.',
        satisfy: 'any',
        conditions: [
          {
            property: 'surveyAnswers',
            op: 'absent',
          },
          {
            property: 'surveyAnswers.length',
            op: 'gt',
            value: 0,
          },
        ],
      },
    ],
  };
}

export interface ChooseSurveyAnswerElementAnswerValue {
  surveyAnswers?: Array<string>;
}
