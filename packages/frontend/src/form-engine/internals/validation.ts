import { FormSchemaElement, FormSchemaElementValidationRule } from '../formSchema';
import { getPropertyValue } from './values';
import {
  FormEngineRuleEvaluationResult,
  FormEngineRuleEvaluationResults,
  FormEngineValidationErrors,
  FormEngineValue,
} from '../types';
import checkConditions, { CheckConditionsConfig } from 'json-conditions';

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
  } else if (element.validation) {
    const validationErrors = element.validation
      .map((validationRule) => evaluateValidationRule(validationRule, formValue)!)
      .filter(Boolean);
    errors.push(...validationErrors);
  }

  return errors;
}

function isEffectivelyEmpty(value: any) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0);
}

function evaluateValidationRule(rule: FormSchemaElementValidationRule, value: object): null | string {
  const rules = rule.conditions ?? [];
  const satisfy = rule.satisfy?.toUpperCase() ?? 'ALL';
  const config: CheckConditionsConfig = { rules, satisfy: satisfy as any };

  try {
    return checkConditions(config, value) ? null : rule.message;
  } catch (e) {
    console.warn('Evaluating validation rule conditions failed.', e, rule, value);
    return null;
  }
}
