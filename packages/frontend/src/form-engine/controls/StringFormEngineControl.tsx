import { StringFormSchemaElement } from '../formSchema';
import { Input, Textarea } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';
import { FormEngineControlProps } from './types';

export default function StringFormEngineControl({
  element,
  ruleEvaluationResult,
}: FormEngineControlProps<StringFormSchemaElement>) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const actualRows = element.rows ?? 1;

  return (
    <DefaultFormControlLayout element={element}>
      {actualRows > 1 ? (
        <Textarea
          isDisabled={ruleEvaluationResult.disable}
          placeholder={element.placeholder}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <Input
          isDisabled={ruleEvaluationResult.disable}
          placeholder={element.placeholder}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </DefaultFormControlLayout>
  );
}
