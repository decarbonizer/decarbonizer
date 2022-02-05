import { DataFrame } from 'data-forge';
import { ActionPlan } from '../../api/actionPlan';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { allCategoryCoreCalculations } from '../core/coreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { linearizeActionPlanAnswers } from './utils';

export function getSurveyAnswersTransformedByActionPlans(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionPlans: Array<ActionPlan>,
  maxActionAnswerDate: Date | undefined,
): Array<SurveyAnswer> {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionPlansDf = new DataFrame(transformingActionPlans);
  const linearizedActionAnswers = linearizeActionPlanAnswers(transformingActionPlansDf)
    .filter((x) => !maxActionAnswerDate || x.endDate > maxActionAnswerDate)
    .map((x) => x.answer);

  return allCategoryCoreCalculations.flatMap(
    (coreCalculations) =>
      coreCalculations
        .transformSurveyAnswers(externalCalculationData, surveyAnswersDf, linearizedActionAnswers)
        .toArray() as Array<SurveyAnswer>,
  );
}
