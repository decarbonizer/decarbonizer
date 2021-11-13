import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { ChoiceOptionSource, FormSchema } from './formSchema';
import { FormEngineChoiceOptionProviders } from './types';
import get from 'lodash-es/get';
import set from 'lodash-es/set';

export interface FormEngineContext {
  schema: FormSchema;
  choiceOptionProviders: FormEngineChoiceOptionProviders;
  value: object;
  setValue: Dispatch<SetStateAction<object>>;
}

export const formEngineContext = createContext<FormEngineContext>(null!);

export function useChoiceOptions(optionSource: ChoiceOptionSource) {
  const { choiceOptionProviders } = useContext(formEngineContext);
  const options = typeof optionSource === 'string' ? choiceOptionProviders[optionSource] : optionSource;
  return options ?? [];
}

export function useValueProperty<T>(property: string) {
  const { value, setValue } = useContext(formEngineContext);
  const propertyValue = useMemo<T>(() => get(value, property), [property, value]);
  const setPropertyValue = (newValue: T) => setValue((previousValue) => set({ ...previousValue }, property, newValue));
  return [propertyValue, setPropertyValue] as const;
}
