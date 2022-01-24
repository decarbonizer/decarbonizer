import { knownUnitInputTemplates, NumberUnitFormSchemaElement } from '../formSchema';
import DefaultFormControlLayout from './DefaultFormControlLayout';
import { useRuleEvaluationResultForElement, useValueProperty } from '../internals/hooks';
import UnitInput from '../../components/UnitInput';
import { FormEngineControlProps } from './types';
import { useContext } from 'react';
import { FormEnginePropsContext } from '../FormEngine';

export default function NumberUnitFormEngineControl({ element }: FormEngineControlProps<NumberUnitFormSchemaElement>) {
  const [value, setValue] = useValueProperty<number | undefined>(element);
  const units = typeof element.units === 'string' ? knownUnitInputTemplates[element.units] : element.units;
  const ruleEvaluationResult = useRuleEvaluationResultForElement(element);
  const isViewOnly = useContext(FormEnginePropsContext).isViewOnly;

  if (isViewOnly) {
    return (
      <DefaultFormControlLayout element={element}>
        {value}{' '}
        {element.normedUnit === 'C' || element.normedUnit === 'F' ? `°${element.normedUnit}` : element.normedUnit}
      </DefaultFormControlLayout>
    );
  }

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
