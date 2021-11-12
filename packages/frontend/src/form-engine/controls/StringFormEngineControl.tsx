import { StringFormSchemaElement } from '../formSchema';
import { Input, Textarea } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface StringFormEngineControlProps {
  element: StringFormSchemaElement;
}

export default function StringFormEngineControl({ element }: StringFormEngineControlProps) {
  const actualRows = element.rows ?? 1;
  return (
    <DefaultFormControlLayout element={element}>
      {actualRows > 1 ? <Textarea placeholder={element.placeholder} /> : <Input placeholder={element.placeholder} />}
    </DefaultFormControlLayout>
  );
}
