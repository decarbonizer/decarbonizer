import { DateRange } from '../../../components/DateRangePicker';
import { DatesFormSchemaElement } from '../../../form-engine/formSchema';

export const chooseTimePeriodElement: DatesFormSchemaElement = {
  id: 'chooseTimePeriod',
  required: false,
  label: '📆 Choose time period',
  type: 'dates',
};

export interface ChooseTimePeriodElementAnswerValue {
  timePeriod?: DateRange;
}
