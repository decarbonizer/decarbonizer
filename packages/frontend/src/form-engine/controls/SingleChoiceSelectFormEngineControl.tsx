import { SingleChoiceSelectFormSchemaElement } from '../formSchema';
import { Select } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useValueProperty } from '../formEngineContext';
import { FormEngineControlProps } from './types';

export default function SingleChoiceSelectFormEngineControl({
  element,
  ruleEvaluationResult,
}: FormEngineControlProps<SingleChoiceSelectFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <Select
        isDisabled={ruleEvaluationResult.disable}
        placeholder={element.placeholder}
        value={value}
        variant="filled"
        onChange={(e) => setValue(e.target.value ? e.target.value : undefined)}>
        {!element.placeholder && <option></option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.display ?? option.value}
          </option>
        ))}
      </Select>
    </DefaultFormControlLayout>
  );
}
