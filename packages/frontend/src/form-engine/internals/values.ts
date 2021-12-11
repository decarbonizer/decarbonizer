import { FormSchemaElement } from '../formSchema';
import { FormEngineValue } from '../types';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import unset from 'lodash-es/unset';

export function getPropertyValue(element: FormSchemaElement, formValue: FormEngineValue) {
  return get(formValue, element.id) ?? element.defaultValue;
}

export function setPropertyValue(
  element: FormSchemaElement,
  newValue: any,
  formValue: FormEngineValue,
): FormEngineValue {
  if (newValue === element.defaultValue) {
    const newFormValue = { ...formValue };
    unset(newFormValue, element.id);
    return newFormValue;
  } else {
    return set({ ...formValue }, element.id, newValue);
  }
}
