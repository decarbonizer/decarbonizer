import { NumberFormSchemaElement } from '../formSchema';
import {
  Flex,
  Input,
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
      {element.unit ? (
        <Flex direction="column">
          <Flex>
            <NumberInput
              isDisabled={ruleEvaluationResult.disable}
              zIndex={1}
              w="100%"
              value={value ?? ''}
              min={element.min}
              max={element.max}
              onChange={(newValue) => setValue(isNaN(+newValue) ? undefined : +newValue)}>
              <NumberInputField borderRightRadius={0} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Input minW="24" flex={1} variant="filled" borderLeftRadius={0} bg="gray.100" value={element.unit} />
          </Flex>
        </Flex>
      ) : (
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
      )}
    </DefaultFormControlLayout>
  );
}
