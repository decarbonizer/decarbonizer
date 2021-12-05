import { FormEngineControlProps } from './types';
import { CheckboxFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { Checkbox, FormLabel } from '@chakra-ui/react';

export default function CheckboxFormEngineControl({ element }: FormEngineControlProps<CheckboxFormSchemaElement>) {
  const [value, setValue] = useValueProperty<boolean | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <Checkbox disabled={ruleEvaluationResult.disable} isChecked={value} onChange={(e) => setValue(e.target.checked)}>
      <FormLabel fontWeight="semibold">{element.label}</FormLabel>
    </Checkbox>
  );
}
