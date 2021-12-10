import { FormEngineControlProps } from './types';
import { CheckboxFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { Checkbox, Flex } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function BooleanCheckBoxFormEngineControl({
  element,
}: FormEngineControlProps<CheckboxFormSchemaElement>) {
  const [value, setValue] = useValueProperty<boolean | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return (
      <DefaultFormControlLayout element={element}>
        {value ? (
          <Checkbox isChecked> {element.label}</Checkbox>
        ) : (
          <Checkbox isChecked={false}>{element.label}</Checkbox>
        )}
      </DefaultFormControlLayout>
    );
  }

  return (
    <Flex align={'flex-start'} width={'100%'}>
      <DefaultFormControlLayout element={element}>
        <Checkbox
          disabled={ruleEvaluationResult.disable}
          isChecked={value ?? false}
          onChange={(e) => {
            setValue(e.target.checked);
          }}>
          {element.label}
        </Checkbox>
      </DefaultFormControlLayout>
    </Flex>
  );
}
