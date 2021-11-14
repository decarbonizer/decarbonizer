import { FormSchemaElement } from '../formSchema';

export interface FormEngineControlProps<T extends FormSchemaElement = FormSchemaElement> {
  element: T;
}
