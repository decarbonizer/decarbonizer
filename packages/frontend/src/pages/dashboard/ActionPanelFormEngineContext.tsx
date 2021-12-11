import { createContext } from 'react';
import { FormEngineHelpers } from '../../form-engine/useFormEngine';

export const ActionPanelFormEngineContext = createContext<ActionPanelFormEngineContextValue>(null!);

export interface ActionPanelFormEngineContextValue {
  actionPanelFormEngine: FormEngineHelpers;
}
