import { createContext } from 'react';

export const ActionPlanContext = createContext<ActionPlanContextValue>(null!);

export interface ActionPlanContextValue {
  actionValue: Record<string, any>;
  setActionValue: (actionValue: Record<string, any>) => void;
}
