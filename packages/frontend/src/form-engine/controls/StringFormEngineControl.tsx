import { StringFormSchemaElement } from '../formSchema';
import { Input, Text, Textarea, VStack } from '@chakra-ui/react';

export interface StringFormEngineControlProps {
  element: StringFormSchemaElement;
}

export default function StringFormEngineControl({ element }: StringFormEngineControlProps) {
  const actualRows = element.rows ?? 1;
  return (
    <VStack>
      <Text>{element.label}</Text>;
      {actualRows > 1 ? <Textarea placeholder={element.placeholder} /> : <Input placeholder={element.placeholder} />}
    </VStack>
  );
}
