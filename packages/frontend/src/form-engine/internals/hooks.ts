import { useContext } from 'react';
import { ChoiceOptionSource, FormSchemaElement } from '../formSchema';
import { FormEnginePropsContext } from '../FormEngine';
import { getPropertyValue, setPropertyValue } from './values';

export function useChoiceOptions(optionSource: ChoiceOptionSource) {
  const { choiceOptionProviders = {} } = useContext(FormEnginePropsContext);
  const options = typeof optionSource === 'string' ? choiceOptionProviders[optionSource] : optionSource;
  return options ?? [];
}

export function useRuleEvaluationResultForElement(element: FormSchemaElement) {
  const { ruleEvaluationResults } = useContext(FormEnginePropsContext);
  return ruleEvaluationResults[element.id] ?? { hide: false, disable: false };
}

export function useValidationErrorsForElement(element: FormSchemaElement) {
  const { validationErrors } = useContext(FormEnginePropsContext);
  return validationErrors[element.id] ?? [];
}

export function useValueProperty<T>(element: FormSchemaElement) {
  const { value, onValueChanged } = useContext(FormEnginePropsContext);
  const propertyValue = getPropertyValue(element, value);

  const setter = (newPropertyValue: T) => {
    const newValue = setPropertyValue(element, newPropertyValue, value);
    onValueChanged({ value: newValue });
  };

  return [propertyValue, setter] as const;
}
