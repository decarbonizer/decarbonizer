import { StringFormSchemaElement } from '../formSchema';
import { Text } from '@chakra-ui/react';

export interface StringFormEngineControlProps {
  element: StringFormSchemaElement;
}

export default function StringFormEngineControl({ element }: StringFormEngineControlProps) {
  return <Text>{element.label}</Text>;
}
