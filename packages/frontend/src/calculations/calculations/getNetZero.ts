import { DataFrame } from 'data-forge';
import { round } from 'lodash-es';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint, getGlobalSummedYearlyFootprintDelta } from './getGlobalSummedYearlyFootprint';

export function getNetZero(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: Array<SurveyAnswer>,
  realEstateId: string,
  actionAnswers: Array<ActionAnswerBase>,
) {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const actionAnswersDf = new DataFrame(actionAnswers);

  const originalRealEstateFootprint = getGlobalSummedYearlyFootprint(
    externalCalculationData,
    externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId && x.value.isInitialSurvey),
    new DataFrame<number, ActionAnswerBase>(),
  );

  const footprintAfterAll = getGlobalSummedYearlyFootprintDelta(
    externalCalculationData,
    surveyAnswersDf,
    actionAnswersDf,
  );

  const netZero = round(
    ((originalRealEstateFootprint - footprintAfterAll.after) / originalRealEstateFootprint) * 100,
    1,
  );

  const newAdjustedAchievedGoal = netZero > 100 ? 100 : netZero;

  const deltaType = getDeltaType(footprintAfterAll.delta);

  return { newAdjustedAchievedGoal, deltaType };
}
