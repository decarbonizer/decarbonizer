import { Flex, HTMLChakraProps, Input, InputProps, Select } from '@chakra-ui/react';
import { AllMeasuresUnits, Unit } from 'convert-units';
import { useMemo, useState } from 'react';
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
}

export default function UnitInput({
  template: { units, defaultUnit, defaultValue = 0, inputProps },
  ...rest
}: UnitInputProps) {
  const [value, setValue] = useState<number>(defaultValue);
  const [selectedUnit, setSelectedUnit] = useState<AllMeasuresUnits>(defaultUnit);
  const unitInfo = useMemo(() => {
    const conversions = units.map((unit) => convert().getUnit(unit));
    return conversions.reduce<Record<string, Unit>>(
      (result, conversion) => ({ ...result, [conversion!.abbr]: conversion!.unit }),
      {},
    );
  }, [units]);

  const handleSelectedUnitChanged = (newUnit: AllMeasuresUnits) => {
    setValue(convert(value).from(selectedUnit).to(newUnit));
    setSelectedUnit(newUnit);
  };

  const handleValueChanged = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <Flex {...rest}>
      <Input type="number" value={value} onChange={(e) => handleValueChanged(+e.target.value)} {...inputProps} />
      <Select value={selectedUnit} onChange={(e) => handleSelectedUnitChanged(e.target.value as AllMeasuresUnits)}>
        <option disabled>Select a unit</option>
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
