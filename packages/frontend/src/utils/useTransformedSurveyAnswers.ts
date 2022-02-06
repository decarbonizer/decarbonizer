import { useMemo } from 'react';
import { useParams } from 'react-router';
import { ActionPlan } from '../api/actionPlan';
import { useAsyncCalculation } from '../calculations/useAsyncCalculation';
import { RealEstatePageParams } from '../routes';

export function useTransformedSurveyAnswers(actionPlan: ActionPlan | undefined) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const thisPlansStartYear = useMemo(() => (actionPlan ? new Date(actionPlan.startDate) : undefined), [actionPlan]);

  return useAsyncCalculation(
    'getSurveyAnswersTransformedByActionPlans',
    (externalCalculationData) => [
      externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId).toArray(),
      externalCalculationData.actionPlans
        .filter((x) => x._id !== actionPlan?._id && x.realEstateId === realEstateId)
        .toArray(),
      thisPlansStartYear,
    ],
    [thisPlansStartYear, realEstateId, actionPlan],
  );
}
