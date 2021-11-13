import { createContext, useContext, useMemo } from 'react';
import { ChoiceOptionSource } from './formSchema';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import { FormEngineProps } from './FormEngine';

export const formEngineContext = createContext<FormEngineProps>(null!);

export function useChoiceOptions(optionSource: ChoiceOptionSource) {
  const { choiceOptionProviders = {} } = useContext(formEngineContext);
  const options = typeof optionSource === 'string' ? choiceOptionProviders[optionSource] : optionSource;
  return options ?? [];
}

export function useValueProperty<T>(property: string) {
  const { value, onValueChanged } = useContext(formEngineContext);
  const propertyValue = useMemo<T>(() => get(value, property), [property, value]);
  const setPropertyValue = (newValue: T) => onValueChanged({ value: set({ ...value }, property, newValue) });
  return [propertyValue, setPropertyValue] as const;
}
