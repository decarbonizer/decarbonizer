import { MultiChoiceFormSchemaElement } from '../formSchema';
import { Checkbox, CheckboxGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';

export default function MultiChoiceFormEngineControl({
  element,
}: FormEngineControlProps<MultiChoiceFormSchemaElement>) {
  const [value, setValue] = useValueProperty<Array<string> | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <CheckboxGroup
        isDisabled={ruleEvaluationResult.disable}
        value={value ?? options.map((option) => option.value)}
        onChange={(e) => setValue(e as any)}
        colorScheme="primary">
        <VStack spacing={2} align="flex-start" ml="4">
          {options.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.display ?? option.value}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </DefaultFormControlLayout>
  );
}
