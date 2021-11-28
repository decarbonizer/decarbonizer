import { HStack, IconButton, Input, Select, Text } from '@chakra-ui/react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import 'react-datepicker/dist/react-datepicker.css';

const defaultMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface DateRangePickerProps {
  value?: DateRange;
  disabled?: boolean;
  months?: Array<string>;
  selectableYears: Array<number>;
  onValueChanged(e: { startDate: Date | undefined; endDate: Date | undefined }): void;
}

export default function DateRangePicker({
  value,
  months = defaultMonths,
  selectableYears: selectableYears,
  disabled = false,
  onValueChanged,
}: DateRangePickerProps) {
  const onChangeStart = (date) => {
    onValueChanged({ startDate: date, endDate: value?.endDate });
  };

  const onChangeEnd = (date) => {
    onValueChanged({ startDate: value?.startDate, endDate: date });
  };

  return (
    <HStack>
      <Text>Start: </Text>
      <CustomDatePicker
        placeholderText="Select start date"
        disabled={disabled}
        selected={value?.startDate}
        startDate={value?.startDate}
        endDate={value?.endDate}
        onChange={onChangeStart}
        selectsStart
        customInput={<Input />}
        disabledKeyboardNavigation
        months={months}
        selectableYears={selectableYears}
      />

      <Text>End: </Text>
      <CustomDatePicker
        placeholderText="Select end date"
        selected={value?.endDate}
        onChange={onChangeEnd}
        startDate={value?.startDate}
        endDate={value?.endDate}
        minDate={value?.startDate}
        selectsEnd
        customInput={<Input />}
        disabledKeyboardNavigation
        months={months}
        selectableYears={selectableYears}
      />
    </HStack>
  );
}

interface CustomDatePickerProps extends ReactDatePickerProps {
  months: Array<string>;
  selectableYears: Array<number>;
}

function CustomDatePicker({ months, selectableYears, ...rest }: CustomDatePickerProps) {
  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <HStack>
          <IconButton
            aria-label="previous"
            icon={<MdNavigateBefore />}
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          />
          <Select size="sm" value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(+value)}>
            {selectableYears.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            size="sm"
            minW="32"
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <IconButton
            aria-label="next"
            icon={<MdNavigateNext />}
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          />
        </HStack>
      )}
      {...rest}
    />
  );
}
