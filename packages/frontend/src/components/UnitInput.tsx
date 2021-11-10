import { Flex, HTMLChakraProps, Input, InputGroup, InputProps, InputRightAddon, Select, Tag, Text } from '@chakra-ui/react';
import { AllMeasuresUnits } from 'convert-units';
import { ChangeEvent, useEffect, useState } from 'react';
import { convert } from '../utils/convert';

export interface UnitInputTemplate {
  units: Array<AllMeasuresUnits>;
  defaultUnit: AllMeasuresUnits;
  defaultValue?: number;
  inputProps?: InputProps;
}

export const energyTemplate: UnitInputTemplate = {
  units: ['Wh', 'kWh', 'GWh'],
  defaultUnit: 'kWh',
};

export interface UnitInputProps extends HTMLChakraProps<'div'> {
  template: UnitInputTemplate;
  onValueChange?(e: { value?: number; unit: AllMeasuresUnits; normedValue?: number; normedUnit: AllMeasuresUnits });
}

export default function UnitInput({
  template: { units, defaultUnit, defaultValue, inputProps },
  onValueChange,
  ...rest
}: UnitInputProps) {
  const [value, setValue] = useState<number | undefined>(defaultValue);
  const [selectedUnit, setSelectedUnit] = useState<AllMeasuresUnits>(defaultUnit);
  const normedValue = convert(value).from(selectedUnit).to(defaultUnit);

  const handleSelectedUnitChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const previousUnit = selectedUnit;
    const newUnit = e.target.value as AllMeasuresUnits;
    setSelectedUnit(newUnit);

    if (value !== undefined) {
      setValue(convert(value).from(previousUnit).to(newUnit));
    }
  };

  const handleValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber;
    setValue(newValue);
  };

  useEffect(() => {
    onValueChange?.({ value, unit: selectedUnit, normedValue, normedUnit: defaultUnit });
  }, [onValueChange, value, selectedUnit, normedValue, defaultUnit]);

  return (
    <Flex direction="column" {...rest}>
      <InputGroup>
        <Input type="number" value={value ?? ''} onChange={handleValueChanged} {...inputProps} />
        <InputRightAddon>
          <Select variant="unstyled" value={selectedUnit} onChange={handleSelectedUnitChanged}>
            <option disabled></option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
      <Text color="gray" fontSize="xs">
        {normedValue} {defaultUnit}
      </Text>
    </Flex>
  );
}
