import { DataFrame } from 'data-forge';
import { createContext, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionPlan } from '../../api/actionPlan';
import { useAsyncCalculation } from '../../calculations/useAsyncCalculation';
import { ActionCategory, ActionsToActionAnswerMap } from '../../data/actions/action';
import { RealEstatePageParams } from '../../routes';

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
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { actionPlanToEdit } = useContext(DashboardContext);
  const thisPlansStartYear = useMemo(
    () => (actionPlanToEdit ? new Date(actionPlanToEdit.endDate) : undefined),
    [actionPlanToEdit],
  );

  return useAsyncCalculation(
    'getSurveyAnswersTransformedByActionPlans',
    (externalCalculationData) => [
      externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId).toArray(),
      externalCalculationData.actionPlans.filter((x) => x.realEstateId === realEstateId).toArray(),
      thisPlansStartYear,
    ],
    [thisPlansStartYear, realEstateId],
  );
}
