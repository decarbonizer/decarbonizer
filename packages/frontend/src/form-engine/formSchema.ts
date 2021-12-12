import { AllMeasuresUnits } from 'convert-units';
import { JsonConditionsRule } from 'json-conditions';

export interface FormSchema {
  pages: Array<FormSchemaPage>;
}

export interface FormSchemaPage {
  name?: string;
  elements: Array<FormSchemaElement>;
}

export interface FormSchemaBaseElement<TType extends string> {
  id: string;
  required: boolean;
  type: TType;
  label?: string;
  helperText?: string;
  rules?: Array<FormSchemaElementRule>;
  validation?: Array<FormSchemaElementValidationRule>;
}

export interface FormSchemaElementRule {
  effect: FormSchemaElementRuleEffect;
  conditions: Array<JsonConditionsRule>;
  satisfy: 'all' | 'any';
}

export type FormSchemaElementRuleEffect = 'hide' | 'disable';

export interface FormSchemaElementValidationRule {
  message: string;
  conditions: Array<JsonConditionsRule>;
  satisfy: 'all' | 'any';
}

export interface StringFormSchemaElement extends FormSchemaBaseElement<'string'> {
  placeholder?: string;
  rows?: number;
}

export interface NumberFormSchemaElement extends FormSchemaBaseElement<'number'> {
  placeholder?: string;
  min?: number;
  max?: number;
}

export const knownUnitInputTemplates: Record<string, Array<AllMeasuresUnits>> = {
  energy: ['Wh', 'kWh', 'GWh'],
  time: ['d', 'h', 'min', 's'],
  timeMinutes: ['min', 's'],
};

export type KnownUnitInputTemplate = keyof typeof knownUnitInputTemplates;

export interface NumberUnitFormSchemaElement extends FormSchemaBaseElement<'number-unit'> {
  units: KnownUnitInputTemplate | Array<AllMeasuresUnits>;
  normedUnit: AllMeasuresUnits;
  defaultSelectedUnit?: AllMeasuresUnits;
  normedMin?: number;
  normedMax?: number;
  placeholder?: string;
}

export interface NumberSliderFormSchemaElement extends FormSchemaBaseElement<'number-slider'> {
  min: number;
  max: number;
}

export interface BooleanFormSchemaElement extends FormSchemaBaseElement<'boolean'> {
  trueText: string;
  falseText: string;
}

export interface ChoiceOption {
  value: string;
  display?: string;
}

export type ChoiceOptionSource = Array<ChoiceOption> | string;

export interface SingleChoiceFormSchemaElement extends FormSchemaBaseElement<'single-choice'> {
  options: ChoiceOptionSource;
}

export interface MultiChoiceFormSchemaElement extends FormSchemaBaseElement<'multi-choice'> {
  options: ChoiceOptionSource;
}

export interface SingleChoiceSelectFormSchemaElement extends FormSchemaBaseElement<'single-choice-select'> {
  placeholder?: string;
  options: ChoiceOptionSource;
}

export type DatesFormSchemaElement = FormSchemaBaseElement<'dates'>;

export type DateTimeFormSchemaElement = FormSchemaBaseElement<'date-time'>;

export type CheckboxFormSchemaElement = FormSchemaBaseElement<'boolean-checkbox'>;

export type FormSchemaElement =
  | StringFormSchemaElement
  | NumberFormSchemaElement
  | NumberUnitFormSchemaElement
  | NumberSliderFormSchemaElement
  | BooleanFormSchemaElement
  | SingleChoiceFormSchemaElement
  | SingleChoiceSelectFormSchemaElement
  | MultiChoiceFormSchemaElement
  | DatesFormSchemaElement
  | DateTimeFormSchemaElement
  | CheckboxFormSchemaElement;

export type FormSchemaElementType = FormSchemaElement['type'];
