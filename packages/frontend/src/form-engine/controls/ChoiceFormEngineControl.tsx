import { ChoiceFormSchemaElement } from '../formSchema';
import { Checkbox, HStack, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';

export interface ChoiceFormEngineControlProps {
  element: ChoiceFormSchemaElement;
}

export default function ChoiceFormEngineControl({ element }: ChoiceFormEngineControlProps) {
  return (
    <VStack>
      <Text>{element.label}</Text>;
      {element.mode === 'single' ? (
        <RadioGroup defaultValue={element.options.length}>
          <HStack spacing={5}>
            {element.options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.display ?? option.value}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
      ) : (
        <HStack>
          {element.options.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.display ?? option.value}
            </Checkbox>
          ))}
        </HStack>
      )}
    </VStack>
  );
}
