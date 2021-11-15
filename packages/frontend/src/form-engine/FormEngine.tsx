import { createContext } from 'react';
import { VStack } from '@chakra-ui/react';
import FormEngineElement from './FormEngineElement';
import { FormSchema } from './formSchema';
import {
  FormEngineChoiceOptionProviders,
  FormEngineRuleEvaluationResults,
  FormEngineValidationErrors,
  FormEngineValue,
} from './types';

export const FormEnginePropsContext = createContext<FormEngineProps>(null!);

export interface FormEngineProps {
  schema: FormSchema;
  choiceOptionProviders?: FormEngineChoiceOptionProviders;
  value: FormEngineValue;
  page: number;
  ruleEvaluationResults: FormEngineRuleEvaluationResults;
  validationErrors: FormEngineValidationErrors;
  onValueChanged(e: { value: FormEngineValue });
}

export default function FormEngine(props: FormEngineProps) {
  const { schema, page } = props;
  const currentSchemaPage = schema.pages[page - 1];

  return (
    <FormEnginePropsContext.Provider value={props}>
      <VStack spacing="4">
        {currentSchemaPage.elements.map((element, index) => (
          <FormEngineElement key={index} element={element} />
        ))}
      </VStack>
    </FormEnginePropsContext.Provider>
  );
}
