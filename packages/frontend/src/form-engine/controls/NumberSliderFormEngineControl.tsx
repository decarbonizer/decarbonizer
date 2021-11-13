import { NumberSliderFormSchemaElement } from '../formSchema';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';

export interface NumberSliderFormEngineControlProps {
  element: NumberSliderFormSchemaElement;
}

export default function NumberSliderFormEngineControl({ element }: NumberSliderFormEngineControlProps) {
  const [value, setValue] = useValueProperty<number | undefined>(element.property);

  return (
    <DefaultFormControlLayout element={element}>
      <Slider
        colorScheme="primary"
        flex="1"
        ml="8"
        step={1}
        min={element.min}
        max={element.max}
        defaultValue={value ?? 0}
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
