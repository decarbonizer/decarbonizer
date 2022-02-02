import { DateRange } from '../../../components/DateRangePicker';
import { DatesFormSchemaElement } from '../../../form-engine/formSchema';

export const chooseTimePeriodElement: DatesFormSchemaElement = {
  id: 'chooseTimePeriod',
  required: false,
  label: '📆 Time period',
  type: 'dates',
};

export interface ChooseTimePeriodElementAnswerValue {
  chooseTimePeriod?: DateRange;
}
