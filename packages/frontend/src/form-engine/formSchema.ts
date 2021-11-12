import { KnownUnitInputTemplate } from '../components/UnitInput';

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

export interface NumberUnitFormSchemaElement extends FormSchemaBaseElement<'number-unit'> {
  unitTemplate: KnownUnitInputTemplate;
  placeholder?: string;
  min?: number;
  max?: number;
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

export interface ChoiceFormSchemaElement extends FormSchemaBaseElement<'choice'> {
  mode: 'single' | 'multi';
  options: Array<ChoiceOption>;
}

export interface ChoiceSelectFormSchemaElement extends FormSchemaBaseElement<'choice-select'> {
  placeholder?: string;
  options: Array<ChoiceOption>;
}

export type FormSchemaElement =
  | StringFormSchemaElement
  | NumberFormSchemaElement
  | NumberUnitFormSchemaElement
  | NumberSliderFormSchemaElement
  | BooleanFormSchemaElement
  | ChoiceFormSchemaElement
  | ChoiceSelectFormSchemaElement;

export type FormSchemaElementType = FormSchemaElement['type'];
