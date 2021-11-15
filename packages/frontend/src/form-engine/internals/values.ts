import { FormSchemaElement } from '../formSchema';
import { FormEngineValue } from '../types';
import get from 'lodash-es/get';
import set from 'lodash-es/set';

export function getPropertyValue(element: FormSchemaElement, formValue: FormEngineValue) {
  return get(formValue, element.id);
}

export function setPropertyValue(element: FormSchemaElement, newValue: any, formValue: FormEngineValue) {
  return set({ ...formValue }, element.id, newValue);
}
