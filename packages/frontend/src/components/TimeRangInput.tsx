import { Button, forwardRef, HStack, Icon, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react';
import { range } from 'lodash';
import DatePicker from 'react-datepicker';
import { FcCalendar } from 'react-icons/fc';
import { Label } from 'recharts';

export interface TimeRangeInputProps {
  value?: {
    startDate?: Date;
    endDate?: Date;
  };
  disabled?: boolean;
  onValueChanged(e: { startDate: Date | undefined; endDate: Date | undefined }): void;
}

export default function TimeRangeInput({ value, disabled = false, onValueChanged }: TimeRangeInputProps) {
  const years = range(1990, new Date().getFullYear() + 1, 1);
  const months = [
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
  const onChangeStart = (date) => {
    onValueChanged({ startDate: date, endDate: value?.endDate });
  };

  const onChangeEnd = (date) => {
    onValueChanged({ startDate: value?.startDate, endDate: date });
  };

  return (
    <HStack>
      <Text>Start: </Text>
      <DatePicker
        placeholderText="Select start date"
        disabled={disabled}
        selected={value?.startDate}
        onChange={onChangeStart}
        startDate={value?.startDate}
        endDate={value?.endDate}
        selectsStart
        customInput={<Input />}
        disabledKeyboardNavigation
      />
      <Text>End: </Text>
      <DatePicker
        placeholderText="Select end date"
        disabled={disabled}
        selected={value?.endDate}
        onChange={onChangeEnd}
        startDate={value?.startDate}
        endDate={value?.endDate}
        minDate={value?.startDate}
        selectsEnd
        customInput={<Input />}
        disabledKeyboardNavigation
      />
    </HStack>
  );
}
