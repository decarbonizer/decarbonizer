import { StringFormSchemaElement } from '../formSchema';
import { Input, Textarea } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';

export interface StringFormEngineControlProps {
  element: StringFormSchemaElement;
}

export default function StringFormEngineControl({ element }: StringFormEngineControlProps) {
  const [value, setValue] = useValueProperty<string | undefined>(element.property);
  const actualRows = element.rows ?? 1;

  return (
    <DefaultFormControlLayout element={element}>
      {actualRows > 1 ? (
        <Textarea placeholder={element.placeholder} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
      ) : (
        <Input placeholder={element.placeholder} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </DefaultFormControlLayout>
  );
}
