import { DataFrame } from 'data-forge';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { ActionCategory, ActionsToActionAnswerMap } from '../../../data/actions/action';

export const ActionPanelContext = createContext<ActionPanelContextValue>(null!);

export type FilledActionAnswers = {
  [K in keyof ActionsToActionAnswerMap]?: ActionAnswerBase<ActionsToActionAnswerMap[K]>;
};

export interface ActionPanelContextValue {
  filledActionAnswers: FilledActionAnswers;
  setFilledActionAnswers: Dispatch<SetStateAction<FilledActionAnswers>>;
  selectedActionCategory?: ActionCategory;
  setSelectedActionCategory: Dispatch<SetStateAction<ActionCategory | undefined>>;
}

export function useFilledActionAnswersDataFrame() {
  const { filledActionAnswers } = useContext(ActionPanelContext);
  return new DataFrame(Object.values(filledActionAnswers).filter(Boolean));
}
