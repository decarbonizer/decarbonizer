import { Text } from '@chakra-ui/react';
import { FormSchemaElement, FormSchemaElementType } from './formSchema';
import StringFormEngineControl from './controls/StringFormEngineControl';
import NumberFormEngineControl from './controls/NumberFormEngineControl';
import BooleanFormEngineControl from './controls/BooleanFormEngineControl';
import SingleChoiceFormEngineControl from './controls/SingleChoiceFormEngineControl';
import NumberSliderFormEngineControl from './controls/NumberSliderFormEngineControl';
import SingleChoiceSelectFormEngineControl from './controls/SingleChoiceSelectFormEngineControl';
import NumberUnitFormEngineControl from './controls/NumberUnitFormEngineControl';
import { ComponentType } from 'react';
import { FormEngineControlProps } from './controls/types';
import { useRuleEvaluationResultForElement } from './internals/hooks';
import DatesFormEngineControl from './controls/DatesFormEngineControl';
import DateTimeFormEngineControl from './controls/DateTimeFormEngineControl';
import CheckboxFormEngineControl from './controls/CheckboxFormEngineControl';
import MultiChoiceFormEngineControl from './controls/MultiChoiceFormEngineControl';

const controls: Record<FormSchemaElementType, ComponentType<FormEngineControlProps<any>>> = {
  ['string']: StringFormEngineControl,
  ['boolean']: BooleanFormEngineControl,
  ['number']: NumberFormEngineControl,
  ['number-slider']: NumberSliderFormEngineControl,
  ['number-unit']: NumberUnitFormEngineControl,
  ['single-choice']: SingleChoiceFormEngineControl,
  ['single-choice-select']: SingleChoiceSelectFormEngineControl,
  ['multi-choice']: MultiChoiceFormEngineControl,
  ['dates']: DatesFormEngineControl,
  ['date-time']: DateTimeFormEngineControl,
  ['check']: CheckboxFormEngineControl,
};

export interface FormEngineElementProps {
  element: FormSchemaElement;
}

export default function FormEngineElement({ element }: FormEngineElementProps) {
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const Control = controls[element.type];

  if (!Control) {
    return <Text>Unknown form schema element type: {element.type}.</Text>;
  }

  return <>{!ruleEvaluationResult.hide && <Control element={element} />}</>;
}
