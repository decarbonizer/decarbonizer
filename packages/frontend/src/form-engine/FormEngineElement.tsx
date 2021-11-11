import StringFormEngineControl from './controls/StringFormEngineControl';
import { FormSchemaElement } from './formSchema';
import { Text } from '@chakra-ui/react';

const controls = {
  ['string']: StringFormEngineControl,
};

export interface FormEngineElementProps {
  element: FormSchemaElement;
}

export default function FormEngineElement({ element }: FormEngineElementProps) {
  const Control = controls[element.type];

  if (!Control) {
    return <Text>Unkown form schema element type: {element.type}.</Text>;
  }

  return <Control element={element} />;
}
