import { VStack } from '@chakra-ui/react';
import FormEngineElement from './FormEngineElement';
import { FormSchema } from './formSchema';
import { FormEngineChoiceOptionProviders } from './types';
import { formEngineContext } from './formEngineContext';
import { useEffect, useState } from 'react';

export interface FormEngineProps {
  schema: FormSchema;
  choiceOptionProviders?: FormEngineChoiceOptionProviders;
  value: object;
  page: number;
  onValueChanged(e: { value: object });
  onPageChanged(e: { page: number });
}

export default function FormEngine({
  schema,
  value: currentValue,
  page: currentPage,
  choiceOptionProviders = {},
  onValueChanged: onCurrentValueChanged,
}: FormEngineProps) {
  const [value, setValue] = useState(currentValue);
  const currentSchemaPage = schema.pages[currentPage - 1];

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    onCurrentValueChanged({ value: value });
  }, [value, onCurrentValueChanged]);

  return (
    <formEngineContext.Provider value={{ schema, choiceOptionProviders, value, setValue }}>
      <VStack spacing="4">
        {currentSchemaPage.elements.map((element, index) => (
          <FormEngineElement key={index} element={element} />
        ))}
      </VStack>
    </formEngineContext.Provider>
  );
}
