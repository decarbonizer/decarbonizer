import { createContext } from 'react';
import { FormSchema } from '../../../form-engine/formSchema';

export const PopUpContext = createContext<PopUpContextValue>(null!);

export interface PopUpContextValue {
  onOpen: (schema: FormSchema) => void;
}
