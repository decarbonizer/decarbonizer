import { NumberSliderFormSchemaElement } from '../formSchema';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { useState } from 'react';
import DefaultFormControlLayout from './DefaultFormControlLayout';

export interface NumberSliderFormEngineControlProps {
  element: NumberSliderFormSchemaElement;
}

export default function NumberSliderFormEngineControl({ element }: NumberSliderFormEngineControlProps) {
  const [value, setValue] = useState(0);

  return (
    <DefaultFormControlLayout element={element}>
      <Slider
        flex="1"
        min={element.min}
        max={element.max}
        step={1}
        onChange={setValue}
        value={value}
        colorScheme="primary"
        ml="8">
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
