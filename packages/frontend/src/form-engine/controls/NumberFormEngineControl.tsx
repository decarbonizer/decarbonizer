import { NumberFormSchemaElement } from '../formSchema';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';

export interface NumberFormEngineControlProps {
  element: NumberFormSchemaElement;
}

export default function NumberFormEngineControl({ element }: NumberFormEngineControlProps) {
  return (
    <VStack>
      <Text>{element.label}</Text>;
      <NumberInput defaultValue={element.placeholder} min={element.min} max={element.max}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper /> <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </VStack>
  );
}
