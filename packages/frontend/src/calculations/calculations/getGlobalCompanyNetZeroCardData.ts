import { DataFrame } from 'data-forge';
import { round } from 'lodash-es';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalCompanyFootprintCardData } from './getGlobalCompanyFootprintCardData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';

export function getGlobalCompanyNetZeroCardData(externalCalculationData: ExternalCalculationData) {
  const globalCompanyFootprintAfterActions = getGlobalCompanyFootprintCardData(externalCalculationData);
  const originalFootprintCompany = getGlobalSummedYearlyFootprint(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    new DataFrame<number, ActionAnswerBase>(),
  );

  const delta = round(originalFootprintCompany, 1) - round(globalCompanyFootprintAfterActions, 1);

  const netZero = round((delta / round(originalFootprintCompany, 1)) * 100, 1);

  return { netZeroAdjusted: Math.round(netZero) > 100 ? 100 : netZero };
}
