import { useContext } from 'react';
import checkConditions, { CheckConditionsConfig } from 'json-conditions';
import { FormSchemaElement, FormSchemaElementRule, FormSchemaElementRuleEffect } from './formSchema';
import { formEngineContext } from './formEngineContext';

export type FormEngineRuleEvaluationResult = Record<FormSchemaElementRuleEffect, boolean>;

export function useCurrentRuleEffects(element: FormSchemaElement): FormEngineRuleEvaluationResult {
  const { value } = useContext(formEngineContext);
  const rules = element.rules ?? [];
  const effects = rules.map((rule) => evaluateFormEngineRule(rule, value));

  return {
    hide: effects.some((effect) => effect === 'hide'),
    disable: effects.some((effect) => effect === 'disable'),
  };
}

export function evaluateFormEngineRule(rule: FormSchemaElementRule, value: object): null | FormSchemaElementRuleEffect {
  const rules = rule.conditions ?? [];
  const satisfy = rule.satisfy?.toUpperCase() ?? 'ALL';
  const log = console.log;
  const config: CheckConditionsConfig = { rules, satisfy: satisfy as any, log };

  try {
    return checkConditions(config, value) ? rule.effect : null;
  } catch (e) {
    console.warn('Evaluating rule conditions failed.', e, rule, value);
    return null;
  }
}
