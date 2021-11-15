import { FormSchemaElement } from '../formSchema';
import { getPropertyValue } from './values';
import {
  FormEngineRuleEvaluationResult,
  FormEngineRuleEvaluationResults,
  FormEngineValidationErrors,
  FormEngineValue,
} from '../types';

export function validateForm(
  elements: Array<FormSchemaElement>,
  ruleEvaluationResults: FormEngineRuleEvaluationResults,
  value: FormEngineValue,
) {
  const result: FormEngineValidationErrors = {};

  for (const element of elements) {
    result[element.id] = validateFormEngineElement(element, ruleEvaluationResults[element.id], value);
  }

  return result;
}

function validateFormEngineElement(
  element: FormSchemaElement,
  elementRuleEvaluationResult: FormEngineRuleEvaluationResult | undefined,
  formValue: FormEngineValue,
): Array<string> {
  // Hidden and disabled fields should not be validated.
  // This would otherwise prevent the form from being submitted.
  if (elementRuleEvaluationResult && (elementRuleEvaluationResult.disable || elementRuleEvaluationResult.hide)) {
    return [];
  }

  const elementValue = getPropertyValue(element, formValue);
  const errors: Array<string> = [];

  if (element.required && isEffectivelyEmpty(elementValue)) {
    errors.push('This field is required.');
  }

  return errors;
}

function isEffectivelyEmpty(value: any) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0);
}
