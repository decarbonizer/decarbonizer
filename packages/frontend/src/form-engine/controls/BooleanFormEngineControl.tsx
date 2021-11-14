import { BooleanFormSchemaElement } from '../formSchema';
import { HStack, Radio, RadioGroup } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';
import { FormEngineControlProps } from './types';

export default function BooleanFormEngineControl({
  element,
  ruleEvaluationResult,
}: FormEngineControlProps<BooleanFormSchemaElement>) {
  const [value, setValue] = useValueProperty<boolean | undefined>(element.property);
  const defaultValue = value?.toString();

  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup
        isDisabled={ruleEvaluationResult.disable}
        defaultValue={defaultValue}
        onChange={(e) => setValue(e === true.toString())}>
        <HStack align="flex-start" spacing={5} ml="4">
          <Radio value={true.toString()} defaultChecked={value === true}>
            {element.trueText}
          </Radio>
          <Radio value={false.toString()} defaultChecked={value === false}>
            {element.falseText}
          </Radio>
        </HStack>
      </RadioGroup>
    </DefaultFormControlLayout>
  );
}
