import { NumberSliderFormSchemaElement } from '../formSchema';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

export interface NumberSliderFormEngineControlProps {
  element: NumberSliderFormSchemaElement;
}

export default function NumberSliderFormEngineControl({ element }: NumberSliderFormEngineControlProps) {
  const [value, setValue] = useState(0);

  return (
    <VStack>
      <Text>{element.label}</Text>;
      <Slider
        flex="1"
        min={element.min}
        max={element.max}
        step={1}
        onChange={setValue}
        value={value}
        colorScheme="primary">
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px">
          {value}
        </SliderThumb>
      </Slider>
    </VStack>
  );
}
