import { SingleChoiceFormSchemaElement } from '../formSchema';
import { Radio, RadioGroup, VStack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useValueProperty } from '../formEngineContext';
import { FormEngineControlProps } from './types';

export default function SingleChoiceFormEngineControl({
  element,
  ruleEvaluationResult,
}: FormEngineControlProps<SingleChoiceFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup isDisabled={ruleEvaluationResult.disable} defaultValue={value} onChange={(e) => setValue(e)}>
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
