import { SingleChoiceFormSchemaElement } from '../formSchema';
import { Radio, RadioGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useValueProperty } from '../formEngineContext';

export interface SingleChoiceFormEngineControlProps {
  element: SingleChoiceFormSchemaElement;
}

export default function SingleChoiceFormEngineControl({ element }: SingleChoiceFormEngineControlProps) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup defaultValue={value} onChange={(e) => setValue(e)}>
        <VStack spacing={2} align="flex-start" ml="4">
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.display ?? option.value}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </DefaultFormControlLayout>
  );
}
