import { createContext, ReactNode } from 'react';
import { Heading, HStack, VStack, Text, Spacer, Box } from '@chakra-ui/react';
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
  isViewOnly?: boolean;
  onValueChanged(e: { value: FormEngineValue });
  buttonPrevious?: ReactNode;
  buttonNext?: ReactNode;
}

export default function FormEngine(props: FormEngineProps) {
  const { schema, page } = props;
  const currentSchemaPage = schema.pages[page - 1];

  return (
    <FormEnginePropsContext.Provider value={props}>
      <VStack spacing="8" align="flex-start">
        <HStack w="100%" align="center">
          {currentSchemaPage.name && (
            <Box>
              <Heading as="h2" size="md" alignSelf="flex-start">
                {currentSchemaPage.name}
              </Heading>
            </Box>
          )}
          <Spacer />
          {props.buttonPrevious && props.buttonNext && (
            <HStack>
              {props.buttonPrevious}
              <Text pl="2" pr="2">
                {page}
              </Text>
              {props.buttonNext}
            </HStack>
          )}
        </HStack>

        {currentSchemaPage.elements.map((element, index) => (
          <FormEngineElement key={index} element={element} />
        ))}
      </VStack>
    </FormEnginePropsContext.Provider>
  );
}
