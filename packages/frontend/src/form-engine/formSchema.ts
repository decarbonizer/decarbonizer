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
