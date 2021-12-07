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
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function NumberFormEngineControl({ element }: FormEngineControlProps<NumberFormSchemaElement>) {
  const [value, setValue] = useValueProperty<number | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return <DefaultFormControlLayout element={element}>{value}</DefaultFormControlLayout>;
  }

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
