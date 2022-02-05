import { DataFrame } from 'data-forge';
import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionPlan } from '../../api/actionPlan';
import { ActionCategory, ActionsToActionAnswerMap } from '../../data/actions/action';
import { useTransformedSurveyAnswers } from '../../utils/useTransformedSurveyAnswers';

export const DashboardContext = createContext<DashboardContextValue>(null!);

export type FilledActionAnswers = {
  [K in keyof ActionsToActionAnswerMap]?: ActionAnswerBase<ActionsToActionAnswerMap[K]>;
};

export interface DashboardContextValue {
  actionPlanToEdit?: ActionPlan;
  filledActionAnswers: FilledActionAnswers;
  setFilledActionAnswers: Dispatch<SetStateAction<FilledActionAnswers>>;
  selectedActionCategory?: ActionCategory;
  setSelectedActionCategory: Dispatch<SetStateAction<ActionCategory | undefined>>;
}

export function useFilledActionAnswersDataFrame() {
  const { filledActionAnswers } = useContext(DashboardContext);
  return useMemo(() => new DataFrame(Object.values(filledActionAnswers).filter(Boolean)), [filledActionAnswers]);
}

export function useTransformedSurveyAnswersForThisActionPlanDashboard() {
  const { actionPlanToEdit } = useContext(DashboardContext);
  return useTransformedSurveyAnswers(actionPlanToEdit);
}
