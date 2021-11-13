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
import { useCurrentRuleEffects } from './rules';

const controls: Record<FormSchemaElementType, ComponentType<FormEngineControlProps<any>>> = {
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
  const ruleEvaluationResult = useCurrentRuleEffects(element);
  const Control = controls[element.type];

  if (!Control) {
    return <Text>Unkown form schema element type: {element.type}.</Text>;
  }

  return <>{!ruleEvaluationResult.hide && <Control element={element} ruleEvaluationResult={ruleEvaluationResult} />}</>;
}
