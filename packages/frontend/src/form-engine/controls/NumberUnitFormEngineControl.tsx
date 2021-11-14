import { knownUnitInputTemplates, NumberUnitFormSchemaElement } from '../formSchema';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import UnitInput from '../../components/UnitInput';
import { FormEngineControlProps } from './types';

export default function NumberUnitFormEngineControl({ element }: FormEngineControlProps<NumberUnitFormSchemaElement>) {
  const [value, setValue] = useValueProperty<number | undefined>(element);
  const units = typeof element.units === 'string' ? knownUnitInputTemplates[element.units] : element.units;
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);

  return (
    <DefaultFormControlLayout element={element}>
      <UnitInput
        isDisabled={ruleEvaluationResult.disable}
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
