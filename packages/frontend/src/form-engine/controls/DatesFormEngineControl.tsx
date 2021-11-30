import { range } from 'lodash';
import DateRangePicker, { DateRange } from '../../components/DateRangePicker';
import { DatesFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DatesFormEngineControl({ element }: FormEngineControlProps<DatesFormSchemaElement>) {
  const [value, setValue] = useValueProperty<DateRange | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const years = range(1990, new Date().getFullYear() + 1, 1);

  return (
    <DefaultFormControlLayout element={element}>
      <DateRangePicker
        disabled={ruleEvaluationResult.disable}
        value={value}
        onValueChanged={(e) => setValue(e)}
        selectableYears={years}
      />
    </DefaultFormControlLayout>
  );
}
