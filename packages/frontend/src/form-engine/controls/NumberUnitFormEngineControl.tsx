import { knownUnitInputTemplates, NumberUnitFormSchemaElement } from '../formSchema';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useValueProperty } from '../formEngineContext';
import UnitInput from '../../components/UnitInput';

export interface NumberUnitFormEngineControlProps {
  element: NumberUnitFormSchemaElement;
}

export default function NumberUnitFormEngineControl({ element }: NumberUnitFormEngineControlProps) {
  const [value, setValue] = useValueProperty<number | undefined>(element.property);
  const units = typeof element.units === 'string' ? knownUnitInputTemplates[element.units] : element.units;

  return (
    <DefaultFormControlLayout element={element}>
      <UnitInput
        units={units}
        normedUnit={element.normedUnit}
        normedValue={value}
        normedMin={element.normedMin}
        normedMax={element.normedMax}
        defaultSelectedUnit={element.defaultSelectedUnit}
        placeholder={element.placeholder}
        onValueChange={(e) => setValue(e.normedValue)}
      />
    </DefaultFormControlLayout>
  );
}
