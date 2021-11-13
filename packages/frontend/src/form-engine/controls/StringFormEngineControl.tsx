import { StringFormSchemaElement } from '../formSchema';
import { Input, Textarea } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface StringFormEngineControlProps {
  element: StringFormSchemaElement;
  onCurrentValueChanged(e: { currentValue: object });
  currentValue: object;
}

export default function StringFormEngineControl({
  element,
  onCurrentValueChanged,
  currentValue,
}: StringFormEngineControlProps) {
  const actualRows = element.rows ?? 1;
  const id = element.property;

  return (
    <DefaultFormControlLayout element={element}>
      {actualRows > 1 ? (
        <Textarea
          placeholder={element.placeholder}
          onChange={(e) => {
            onCurrentValueChanged({
              currentValue: {
                ...currentValue,
                [id]: e.target.value,
              },
            });
          }}
          value={currentValue[id] || ''}
        />
      ) : (
        <Input
          placeholder={element.placeholder}
          onChange={(e) => {
            onCurrentValueChanged({
              currentValue: {
                ...currentValue,
                [id]: e.target.value,
              },
            });
          }}
          value={currentValue[id] || ''}
        />
      )}
    </DefaultFormControlLayout>
  );
}
