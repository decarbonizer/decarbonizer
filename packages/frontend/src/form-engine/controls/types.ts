import { FormSchemaElement } from '../formSchema';
import { FormEngineRuleEvaluationResult } from '../rules';

export interface FormEngineControlProps<T extends FormSchemaElement = FormSchemaElement> {
  element: T;
  ruleEvaluationResult: FormEngineRuleEvaluationResult;
}
