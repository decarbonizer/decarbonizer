import { SingleChoiceSelectFormSchemaElement } from '../formSchema';
import { Select } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions, useValueProperty } from '../formEngineContext';

export interface SingleChoiceSelectFormEngineControlProps {
  element: SingleChoiceSelectFormSchemaElement;
}

export default function SingleChoiceSelectFormEngineControl({ element }: SingleChoiceSelectFormEngineControlProps) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <Select
        placeholder={element.placeholder}
        value={value}
        variant="filled"
        onChange={(e) => setValue(e.target.value)}>
        {!element.placeholder && <option disabled></option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.display ?? option.value}
          </option>
        ))}
      </Select>
    </DefaultFormControlLayout>
  );
}
