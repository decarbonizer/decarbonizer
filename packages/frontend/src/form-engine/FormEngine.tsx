import { VStack } from '@chakra-ui/react';
import FormEngineElement from './FormEngineElement';
import { FormSchema } from './formSchema';
import { FormEngineChoiceOptionProviders } from './types';
import { formEngineContext } from './formEngineContext';

export interface FormEngineProps {
  schema: FormSchema;
  choiceOptionProviders?: FormEngineChoiceOptionProviders;
  value: object;
  page: number;
  onValueChanged(e: { value: object });
  onPageChanged(e: { page: number });
}

export default function FormEngine(props: FormEngineProps) {
  const { schema, page } = props;
  const currentSchemaPage = schema.pages[page - 1];

  return (
    <formEngineContext.Provider value={props}>
      <VStack spacing="4">
        {currentSchemaPage.elements.map((element, index) => (
          <FormEngineElement key={index} element={element} />
        ))}
      </VStack>
    </formEngineContext.Provider>
  );
}
