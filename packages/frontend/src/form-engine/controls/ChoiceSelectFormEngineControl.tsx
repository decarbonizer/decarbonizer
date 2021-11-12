import { ChoiceSelectFormSchemaElement } from '../formSchema';
import { Select } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useChoiceOptions } from '../formEngineContext';

export interface ChoiceSelectFormEngineControlProps {
  element: ChoiceSelectFormSchemaElement;
}

export default function ChoiceSelectFormEngineControl({ element }: ChoiceSelectFormEngineControlProps) {
  const options = useChoiceOptions(element.options);

  return (
    <DefaultFormControlLayout element={element}>
      <Select placeholder={element.placeholder} variant="filled">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.display ?? option.value}
          </option>
        ))}
      </Select>
    </DefaultFormControlLayout>
  );
}
