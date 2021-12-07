import { FormEngineControlProps } from './types';
import { CheckboxFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { Checkbox, Flex } from '@chakra-ui/react';

export default function CheckboxFormEngineControl({ element }: FormEngineControlProps<CheckboxFormSchemaElement>) {
  const [value, setValue] = useValueProperty<boolean | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <Flex align={'flex-start'} width={'100%'}>
      <Checkbox
        disabled={ruleEvaluationResult.disable}
        isChecked={value ?? false}
        onChange={(e) => {
          setValue(e.target.checked);
        }}>
        {element.label}
      </Checkbox>
    </Flex>
  );
}
