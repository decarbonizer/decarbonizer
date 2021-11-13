import { Text } from '@chakra-ui/react';
import { FormSchemaElement } from './formSchema';
import StringFormEngineControl from './controls/StringFormEngineControl';
import NumberFormEngineControl from './controls/NumberFormEngineControl';
import BooleanFormEngineControl from './controls/BooleanFormEngineControl';
import SingleChoiceFormEngineControl from './controls/SingleChoiceFormEngineControl';
import NumberSliderFormEngineControl from './controls/NumberSliderFormEngineControl';
import SingleChoiceSelectFormEngineControl from './controls/SingleChoiceSelectFormEngineControl';
import NumberUnitFormEngineControl from './controls/NumberUnitFormEngineControl';

const controls = {
  ['string']: StringFormEngineControl,
  ['boolean']: BooleanFormEngineControl,
  ['number']: NumberFormEngineControl,
  ['number-slider']: NumberSliderFormEngineControl,
  ['number-unit']: NumberUnitFormEngineControl,
  ['single-choice']: SingleChoiceFormEngineControl,
  ['single-choice-select']: SingleChoiceSelectFormEngineControl,
};

export interface FormEngineElementProps {
  element: FormSchemaElement;
}

export default function FormEngineElement({ element }: FormEngineElementProps) {
  const Control = controls[element.type];

  if (!Control) {
    return <Text>Unknown form schema element type: {element.type}.</Text>;
  }

  return <Control element={element} />;
}
