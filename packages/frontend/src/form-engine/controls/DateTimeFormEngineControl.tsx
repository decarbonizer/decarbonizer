import { Input } from '@chakra-ui/react';
import { useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormEnginePropsContext } from '../FormEngine';
import { DateTimeFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DateTimeFormEngineControl({ element }: FormEngineControlProps<DateTimeFormSchemaElement>) {
  const [value, setValue] = useValueProperty<Date | string | null | undefined>(element);
  const parsedValue = value ? new Date(value) : undefined;
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return <DefaultFormControlLayout element={element}>{parsedValue?.toLocaleDateString()}</DefaultFormControlLayout>;
  }

  return (
    <DefaultFormControlLayout element={element}>
      <DatePicker
        disabled={ruleEvaluationResult.disable}
        selected={parsedValue}
        onChange={(date) => setValue(date as Date | null)}
        showTimeSelect
        timeIntervals={15}
        customInput={<Input />}
      />
    </DefaultFormControlLayout>
  );
}
