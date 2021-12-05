import { range } from 'lodash';
import { useContext } from 'react';
import DateRangePicker, { DateRange } from '../../components/DateRangePicker';
import { FormEnginePropsContext } from '../FormEngine';
import { DatesFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DatesFormEngineControl({ element }: FormEngineControlProps<DatesFormSchemaElement>) {
  const [value, setValue] = useValueProperty<DateRange | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const years = range(1990, new Date().getFullYear() + 1, 1);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return (
      <DefaultFormControlLayout element={element}>
        {value?.startDate?.toLocaleDateString()} - {value?.endDate?.toLocaleDateString()}
      </DefaultFormControlLayout>
    );
  }

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
