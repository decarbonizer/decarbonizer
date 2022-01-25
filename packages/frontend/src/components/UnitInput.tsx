import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react';
import { AllMeasuresUnits } from 'convert-units';
import { ChangeEvent, useState } from 'react';
import { convert } from '../utils/convert';

export interface UnitInputValueChangedArgs {
  value?: number;
  unit: AllMeasuresUnits;
  normedValue?: number;
  normedUnit: AllMeasuresUnits;
}

export interface UnitInputProps {
  units: Array<AllMeasuresUnits>;
  normedUnit: AllMeasuresUnits;
  normedValue: number | undefined;
  normedMin?: number;
  normedMax?: number;
  defaultSelectedUnit?: AllMeasuresUnits;
  placeholder?: string;
  isDisabled?: boolean;
  onValueChange(args: UnitInputValueChangedArgs);
}

export default function UnitInput({
  units,
  normedUnit,
  normedValue,
  normedMin,
  normedMax,
  defaultSelectedUnit,
  placeholder,
  isDisabled,
  onValueChange,
}: UnitInputProps) {
  const [selectedUnit, setSelectedUnit] = useState<AllMeasuresUnits>(defaultSelectedUnit ?? normedUnit);
  const value = convertNorm(normedValue, 'unnorm', normedUnit, selectedUnit);
  const min = convertNorm(normedMin, 'unnorm', normedUnit, selectedUnit);
  const max = convertNorm(normedMax, 'unnorm', normedUnit, selectedUnit);

  const raiseValueChange = (nextValue: number | undefined, nextValueUnit: AllMeasuresUnits) => {
    onValueChange({
      value: nextValue,
      unit: nextValueUnit,
      normedValue: convertNorm(nextValue, 'norm', normedUnit, nextValueUnit),
      normedUnit,
    });
  };

  const handleSelectedUnitChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const previousUnit = selectedUnit;
    const newUnit = e.target.value as AllMeasuresUnits;
    setSelectedUnit(newUnit);
    raiseValueChange(value, previousUnit);
  };

  const handleValueChanged = (newValue: string) => {
    raiseValueChange(parseValue(newValue), selectedUnit);
  };

  return (
    <Flex direction="column">
      <Flex>
        <NumberInput
          isDisabled={isDisabled}
          w="100%"
          zIndex={1}
          min={min}
          max={max}
          value={value ?? ''}
          onChange={(newValue) => handleValueChanged(newValue)}>
          <NumberInputField borderRightRadius={0} placeholder={placeholder} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          isDisabled={isDisabled}
          minW="28"
          flex={1}
          variant="filled"
          borderLeftRadius={0}
          value={selectedUnit}
          onChange={handleSelectedUnitChanged}>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit === 'C' || unit === 'F' ? `°${unit}` : unit}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
}

function parseValue(value: string) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

function convertNorm(
  value: number | undefined,
  direction: 'norm' | 'unnorm',
  normedUnit: AllMeasuresUnits,
  selectedUnit: AllMeasuresUnits,
) {
  if (value === undefined) {
    return undefined;
  }

  const from = direction === 'norm' ? selectedUnit : normedUnit;
  const to = direction === 'norm' ? normedUnit : selectedUnit;
  return convert(value).from(from).to(to);
}
