import { BooleanFormSchemaElement } from '../formSchema';
import { HStack, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';

export interface BooleanFormEngineControlProps {
  element: BooleanFormSchemaElement;
}

export default function BooleanFormEngineControl({ element }: BooleanFormEngineControlProps) {
  return (
    <VStack>
      <Text>{element.label}</Text>;
      <RadioGroup defaultValue="2">
        <HStack spacing={5}>
          <Radio value="true">{element.trueText}</Radio>
          <Radio value="false">{element.falseText}</Radio>
        </HStack>
      </RadioGroup>
    </VStack>
  );
}
