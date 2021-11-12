import { BooleanFormSchemaElement } from '../formSchema';
import { HStack, Radio, RadioGroup } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface BooleanFormEngineControlProps {
  element: BooleanFormSchemaElement;
}

export default function BooleanFormEngineControl({ element }: BooleanFormEngineControlProps) {
  return (
    <DefaultFormControlLayout element={element}>
      <RadioGroup>
        <HStack spacing={5} align="flex-start" ml="4">
          <Radio value="true">{element.trueText}</Radio>
          <Radio value="false">{element.falseText}</Radio>
        </HStack>
      </RadioGroup>
    </DefaultFormControlLayout>
  );
}
