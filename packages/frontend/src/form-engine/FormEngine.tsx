import { VStack } from '@chakra-ui/react';
import FormEngineElement from './FormEngineElement';
import { FormSchema } from './formSchema';
import { FormEngineChoiceOptionProviders } from './types';
import { formEngineContext } from './formEngineContext';

export interface FormEngineProps {
  schema: FormSchema;
  choiceOptionProviders?: FormEngineChoiceOptionProviders;
  currentValue: object;
  currentPage: number;
  onCurrentValueChanged(e: { currentValue: object });
  onCurrentPageChanged(e: { currentPage: number });
}

export default function FormEngine({ schema, currentPage, choiceOptionProviders = {} }: FormEngineProps) {
  const currentSchemaPage = schema.pages[currentPage - 1];

  return (
    <formEngineContext.Provider value={{ schema, choiceOptionProviders }}>
      <VStack spacing="4">
        {currentSchemaPage.elements.map((element, index) => (
          <FormEngineElement key={index} element={element} />
        ))}
      </VStack>
    </formEngineContext.Provider>
  );
}
