import { Text } from '@chakra-ui/react';
import { range } from 'lodash';
import { useContext } from 'react';
import DateRangePicker, { DateRange } from '../../components/DateRangePicker';
import { FormEnginePropsContext } from '../FormEngine';
import { DatesFormSchemaElement } from '../formSchema';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { FormEngineControlProps } from './types';

export default function DatesFormEngineControl({ element }: FormEngineControlProps<DatesFormSchemaElement>) {
  const [value, setValue] = useValueProperty<DateRange | { startDate: string; endDate: string } | undefined>(element);
  const startDate = value?.startDate ? new Date(value.startDate) : undefined;
  const endDate = value?.endDate ? new Date(value.endDate) : undefined;
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const years = range(1990, new Date().getFullYear() + 1, 1);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    if (!value) {
      return (
        <DefaultFormControlLayout element={element}>
          <Text fontStyle="italic" color="gray.500">
            No time period selected.
          </Text>
        </DefaultFormControlLayout>
      );
    }

    return (
      <DefaultFormControlLayout element={element}>
        {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
      </DefaultFormControlLayout>
    );
  }

  return (
    <DefaultFormControlLayout element={element}>
      <DateRangePicker
        disabled={ruleEvaluationResult.disable}
        value={{ startDate, endDate }}
        onValueChanged={(e) => setValue(e)}
        selectableYears={years}
      />
    </DefaultFormControlLayout>
  );
}
