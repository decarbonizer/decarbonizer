import { VStack } from '@chakra-ui/react';
import FormEngineElement from './FormEngineElement';
import { FormSchema } from './formSchema';

export interface FormEngineProps {
  schema: FormSchema;
  currentValue: object;
  currentPage: number;
  onCurrentValueChanged(e: { currentValue: object });
  onCurrentPageChanged(e: { currentPage: number });
}

export default function FormEngine({ schema, currentPage }: FormEngineProps) {
  const currentSchemaPage = schema.pages[currentPage - 1];

  return (
    <VStack spacing="4">
      {currentSchemaPage.elements.map((element, index) => (
        <FormEngineElement key={index} element={element} />
      ))}
    </VStack>
  );
}
