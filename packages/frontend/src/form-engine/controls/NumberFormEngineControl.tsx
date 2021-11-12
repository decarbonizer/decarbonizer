import { NumberFormSchemaElement } from '../formSchema';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface NumberFormEngineControlProps {
  element: NumberFormSchemaElement;
}

export default function NumberFormEngineControl({ element }: NumberFormEngineControlProps) {
  return (
    <DefaultFormControlLayout element={element}>
      <NumberInput defaultValue={element.placeholder} min={element.min} max={element.max}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper /> <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </DefaultFormControlLayout>
  );
}
