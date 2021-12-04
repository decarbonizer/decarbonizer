import { SingleChoiceFormSchemaElement } from '../formSchema';
import { Radio, RadioGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';

export default function SingleChoiceFormEngineControl({
  element,
}: FormEngineControlProps<SingleChoiceFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup isDisabled={ruleEvaluationResult.disable} value={value ?? ''} onChange={(e) => setValue(e)}>
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
