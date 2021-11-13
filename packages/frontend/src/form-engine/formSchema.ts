import { AllMeasuresUnits } from 'convert-units';
import { JsonConditionsRule } from 'json-conditions';
export interface FormSchema {
  pages: Array<FormSchemaPage>;
}

export interface FormSchemaPage {
  elements: Array<FormSchemaElement>;
}

export interface FormSchemaBaseElement<TType extends string> {
  property: string;
  required: boolean;
  label: string;
  type: TType;
  helperText?: string;
  rules?: Array<FormSchemaElementRule>;
}

export interface FormSchemaElementRule {
  effect: FormSchemaElementRuleEffect;
  conditions: Array<JsonConditionsRule>;
  satisfy: 'all' | 'any';
}

export type FormSchemaElementRuleEffect = 'hide' | 'disable';

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

export interface SingleChoiceSelectFormSchemaElement extends FormSchemaBaseElement<'single-choice-select'> {
  placeholder?: string;
  options: ChoiceOptionSource;
}

export type FormSchemaElement =
  | StringFormSchemaElement
  | NumberFormSchemaElement
  | NumberUnitFormSchemaElement
  | NumberSliderFormSchemaElement
  | BooleanFormSchemaElement
  | SingleChoiceFormSchemaElement
  | SingleChoiceSelectFormSchemaElement;

export type FormSchemaElementType = FormSchemaElement['type'];
