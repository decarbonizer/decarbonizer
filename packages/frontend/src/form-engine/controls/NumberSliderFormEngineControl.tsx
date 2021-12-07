import { NumberSliderFormSchemaElement } from '../formSchema';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function NumberSliderFormEngineControl({
  element,
}: FormEngineControlProps<NumberSliderFormSchemaElement>) {
  const [value, setValue] = useValueProperty<number | undefined>(element);
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return <DefaultFormControlLayout element={element}>{value}</DefaultFormControlLayout>;
  }

  return (
    <DefaultFormControlLayout element={element}>
      <Slider
        isDisabled={ruleEvaluationResult.disable}
        colorScheme="primary"
        flex="1"
        ml="8"
        step={1}
        min={element.min}
        max={element.max}
        value={value ?? 0}
        onChangeEnd={setValue}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px">
          {value}
        </SliderThumb>
      </Slider>
    </DefaultFormControlLayout>
  );
}
