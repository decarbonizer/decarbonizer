import { ChoiceSelectFormSchemaElement } from '../formSchema';
import { Select, Text, VStack } from '@chakra-ui/react';

export interface ChoiceSelectFormEngineControlProps {
  element: ChoiceSelectFormSchemaElement;
}

export default function ChoiceSelectFormEngineControl({ element }: ChoiceSelectFormEngineControlProps) {
  return (
    <VStack>
      <Text>{element.label}</Text>
      <Select placeholder={element.placeholder} variant="filled">
        {element.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.display ?? option.value}
          </option>
        ))}
      </Select>
    </VStack>
  );
}
