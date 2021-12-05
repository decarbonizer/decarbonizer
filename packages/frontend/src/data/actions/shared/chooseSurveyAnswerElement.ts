import { MultiChoiceFormSchemaElement } from '../../../form-engine/formSchema';

export const chooseSurveyAnswerElement: MultiChoiceFormSchemaElement = {
  id: 'surveyAnswers',
  required: false,
  label: '📩 Apply action to these surveys',
  type: 'multi-choice',
  options: 'currentRealEstateSurveyAnswers',
};

export interface ChooseSurveyAnswerElementAnswerValue {
  surveyAnswers: Array<string>;
}
