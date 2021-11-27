import { FormSchema } from '../form-engine/formSchema';
import { ApiObject } from './apiObject';

export interface Survey extends ApiObject {
  identifier: string;
  name: string;
  imageUrl: string;
  description: string;
  schema: FormSchema;
}
