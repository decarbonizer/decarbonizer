import { SingleChoiceFormSchemaElement } from '../formSchema';
import { Radio, RadioGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function SingleChoiceFormEngineControl({
  element,
}: FormEngineControlProps<SingleChoiceFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const options = useChoiceOptions(element.options);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return (
      <DefaultFormControlLayout element={element}>
        {options.find((option) => option.value === value)?.display ?? value}
      </DefaultFormControlLayout>
    );
  }

  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup
        isDisabled={ruleEvaluationResult.disable}
        value={value ?? ''}
        onChange={(e) => setValue(e)}
        colorScheme="primary">
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
