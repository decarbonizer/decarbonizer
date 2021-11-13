import StringFormEngineControl from './controls/StringFormEngineControl';
import NumberFormEngineControl from './controls/NumberFormEngineControl';
import BooleanFormEngineControl from './controls/BooleanFormEngineControl';
import ChoiceFormEngineControl from './controls/ChoiceFormEngineControl';
import { FormSchemaElement } from './formSchema';
import { Text } from '@chakra-ui/react';
import NumberSliderFormEngineControl from './controls/NumberSliderFormEngineControl';
import ChoiceSelectFormEngineControl from './controls/ChoiceSelectFormEngineControl';

const controls = {
  ['string']: StringFormEngineControl,
  ['number']: NumberFormEngineControl,
  ['boolean']: BooleanFormEngineControl,
  ['choice']: ChoiceFormEngineControl,
  ['number-slider']: NumberSliderFormEngineControl,
  ['choice-select']: ChoiceSelectFormEngineControl,
};

export interface FormEngineElementProps {
  element: FormSchemaElement;
  onCurrentValueChanged(e: { currentValue: object });
  currentValue: object;
}

export default function FormEngineElement({ element, onCurrentValueChanged, currentValue }: FormEngineElementProps) {
  const Control = controls[element.type];

  if (!Control) {
    return <Text>Unknown form schema element type: {element.type}.</Text>;
  }

  return <Control element={element} onCurrentValueChanged={onCurrentValueChanged} currentValue={currentValue} />;
}
