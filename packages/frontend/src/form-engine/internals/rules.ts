import checkConditions, { CheckConditionsConfig } from 'json-conditions';
import { FormSchemaElement, FormSchemaElementRule, FormSchemaElementRuleEffect } from '../formSchema';
import { FormEngineRuleEvaluationResult, FormEngineRuleEvaluationResults, FormEngineValue } from '../types';

export function evaluteFormRules(elements: Array<FormSchemaElement>, value: FormEngineValue) {
  const result: FormEngineRuleEvaluationResults = {};

  for (const element of elements) {
    if (element.rules?.length) {
      result[element.id] = evaluateFormSchemaElementRules(element, value);
    }
  }

  return result;
}

function evaluateFormSchemaElementRules(element: FormSchemaElement, value: object): FormEngineRuleEvaluationResult {
  const rules = element.rules ?? [];
  const effects = rules.map((rule) => evaluateFormEngineRule(rule, value));

  return {
    hide: effects.some((effect) => effect === 'hide'),
    disable: effects.some((effect) => effect === 'disable'),
  };
}

function evaluateFormEngineRule(rule: FormSchemaElementRule, value: object): null | FormSchemaElementRuleEffect {
  const rules = rule.conditions ?? [];
  const satisfy = rule.satisfy?.toUpperCase() ?? 'ALL';
  const config: CheckConditionsConfig = { rules, satisfy: satisfy as any };

  try {
    return checkConditions(config, value) ? rule.effect : null;
  } catch (e) {
    console.warn('Evaluating rule conditions failed.', e, rule, value);
    return null;
  }
}
