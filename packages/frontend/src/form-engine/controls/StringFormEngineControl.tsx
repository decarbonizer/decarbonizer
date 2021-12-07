import { StringFormSchemaElement } from '../formSchema';
import { Input, Textarea } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function StringFormEngineControl({ element }: FormEngineControlProps<StringFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const actualRows = element.rows ?? 1;
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return <DefaultFormControlLayout element={element}>{value}</DefaultFormControlLayout>;
  }

  return (
    <DefaultFormControlLayout element={element}>
      {actualRows > 1 ? (
        <Textarea
          isDisabled={ruleEvaluationResult.disable}
          placeholder={element.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <Input
          isDisabled={ruleEvaluationResult.disable}
          placeholder={element.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </DefaultFormControlLayout>
  );
}
