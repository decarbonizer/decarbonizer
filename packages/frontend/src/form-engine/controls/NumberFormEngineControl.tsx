import { NumberFormSchemaElement } from '../formSchema';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';

export default function NumberFormEngineControl({ element }: FormEngineControlProps<NumberFormSchemaElement>) {
  const [value, setValue] = useValueProperty<number | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <DefaultFormControlLayout element={element}>
      <NumberInput
        isDisabled={ruleEvaluationResult.disable}
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
