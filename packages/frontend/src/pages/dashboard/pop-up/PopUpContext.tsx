import { createContext } from 'react';
import { PopUpSchema } from './PopUp';

export const PopUpContext = createContext<PopUpContextValue>(null!);

export interface PopUpContextValue {
  onOpen: (schema: PopUpSchema) => void;
}
