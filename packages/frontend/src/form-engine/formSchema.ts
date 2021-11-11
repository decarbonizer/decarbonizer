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
}

export interface StringFormSchemaElement extends FormSchemaBaseElement<'string'> {
  placeholder?: string;
}

export interface StringMultiLineFormSchemaElement extends FormSchemaBaseElement<'string-multi-line'> {
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

export interface BooleanFormSchemaElement extends FormSchemaBaseElement<'boolean'> {
  trueText?: string;
  falseText?: string;
}

export interface ChoiceFormSchemaElement extends FormSchemaBaseElement<'choice'> {
  mode: 'single' | 'multi';
  options: Array<{
    value: string;
    display?: string;
  }>;
}

export type FormSchemaElement =
  | StringFormSchemaElement
  | StringMultiLineFormSchemaElement
  | NumberFormSchemaElement
  | NumberUnitFormSchemaElement
  | BooleanFormSchemaElement
  | ChoiceFormSchemaElement;

export type FormSchemaElementType = FormSchemaElement['type'];
