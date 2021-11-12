import { ChoiceFormSchemaElement } from '../formSchema';
import { Checkbox, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface ChoiceFormEngineControlProps {
  element: ChoiceFormSchemaElement;
}

export default function ChoiceFormEngineControl({ element }: ChoiceFormEngineControlProps) {
  return (
    <DefaultFormControlLayout element={element}>
      {element.mode === 'single' ? (
        <RadioGroup defaultValue={element.options.length}>
          <VStack spacing={2} align="flex-start" ml="4">
            {element.options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.display ?? option.value}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
      ) : (
        <VStack spacing={2} align="flex-start" ml="4">
          {element.options.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.display ?? option.value}
            </Checkbox>
          ))}
        </VStack>
      )}
    </DefaultFormControlLayout>
  );
}
