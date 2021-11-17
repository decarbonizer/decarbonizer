import { FormSchema } from '../form-engine/formSchema';
import { ApiObject } from './apiObject';

export interface Survey extends ApiObject {
  name: string;
  schema: FormSchema;
}
