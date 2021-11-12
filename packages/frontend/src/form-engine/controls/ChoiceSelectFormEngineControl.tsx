import { ChoiceSelectFormSchemaElement } from '../formSchema';
import { Select } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface ChoiceSelectFormEngineControlProps {
  element: ChoiceSelectFormSchemaElement;
}

export default function ChoiceSelectFormEngineControl({ element }: ChoiceSelectFormEngineControlProps) {
  return (
    <DefaultFormControlLayout element={element}>
      <Select placeholder={element.placeholder} variant="filled">
        {element.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.display ?? option.value}
          </option>
        ))}
      </Select>
    </DefaultFormControlLayout>
  );
}
