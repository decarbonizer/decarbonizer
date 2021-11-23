import { Input } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTimeFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DateTimeFormEngineControl({ element }: FormEngineControlProps<DateTimeFormSchemaElement>) {
  const [value, setValue] = useValueProperty<Date | null | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <DefaultFormControlLayout element={element}>
      <DatePicker
        disabled={ruleEvaluationResult.disable}
        selected={value}
        onChange={(date) => setValue(date as Date | null)}
        showTimeSelect
        timeIntervals={15}
        customInput={<Input />}
      />
    </DefaultFormControlLayout>
  );
}
