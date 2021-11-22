import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DatesFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DatesFormEngineControl({ element }: FormEngineControlProps<DatesFormSchemaElement>) {
  const [value, setValue] = useValueProperty<{ startDate: Date | null; endDate: Date | null } | undefined>(element);
  const initialValue = { startDate: null, endDate: null };
  const startDate = value?.startDate;
  const endDate = value?.endDate;
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <DefaultFormControlLayout element={element}>
      <DatePicker
        disabled={ruleEvaluationResult.disable}
        selected={startDate}
        onChange={(date) => setValue({ ...(value ?? initialValue), startDate: date as Date | null })}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        disabled={ruleEvaluationResult.disable}
        selected={endDate}
        onChange={(date) => setValue({ ...(value ?? initialValue), endDate: date as Date | null })}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </DefaultFormControlLayout>
  );
}
