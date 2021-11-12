import { createContext, useContext } from 'react';
import { ChoiceOptionSource, FormSchema } from './formSchema';
import { FormEngineChoiceOptionProviders } from './types';

export interface FormEngineContext {
  schema: FormSchema;
  choiceOptionProviders: FormEngineChoiceOptionProviders;
}

export const formEngineContext = createContext<FormEngineContext>(null!);

export function useChoiceOptions(optionSource: ChoiceOptionSource) {
  const { choiceOptionProviders } = useContext(formEngineContext);
  const options = typeof optionSource === 'string' ? choiceOptionProviders[optionSource] : optionSource;
  return options ?? [];
}
