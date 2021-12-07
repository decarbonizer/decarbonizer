import { Text } from '@chakra-ui/react';
import { SingleChoiceSelectFormSchemaElement } from '../formSchema';
import { Select } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function SingleChoiceSelectFormEngineControl({
  element,
}: FormEngineControlProps<SingleChoiceSelectFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const options = useChoiceOptions(element.options);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    if (!value) {
      return (
        <DefaultFormControlLayout element={element}>
          <Text fontStyle="italic" color="gray.500">
            No value selected.
          </Text>
        </DefaultFormControlLayout>
      );
    }
    return (
      <DefaultFormControlLayout element={element}>
        {options.find((option) => option.value === value)?.display ?? value}
      </DefaultFormControlLayout>
    );
  }

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
