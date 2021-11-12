import { NumberFormSchemaElement } from '../formSchema';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';

export interface NumberFormEngineControlProps {
  element: NumberFormSchemaElement;
}

export default function NumberFormEngineControl({ element }: NumberFormEngineControlProps) {
  const [value, setValue] = useValueProperty<number | undefined>(element.property);

  return (
    <DefaultFormControlLayout element={element}>
      <NumberInput
        value={value ?? ''}
        min={element.min}
        max={element.max}
        onChange={(newValue) => setValue(isNaN(+newValue) ? undefined : +newValue)}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper /> <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </DefaultFormControlLayout>
  );
}
