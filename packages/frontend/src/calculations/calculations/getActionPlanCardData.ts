import { IDataFrame, DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { DeltaResult } from '../../utils/deltaType';
import { businessTravelCoreCalculations } from '../core/businessTravelCoreCalculations';
import { CategoryCoreCalculations } from '../core/categoryCoreCalculations';
import { electricityCoreCalculations } from '../core/electricityCoreCalculations';
import { heatingCoreCalculations } from '../core/heatingCoreCalculations';
import { illuminationCoreCalculations } from '../core/illuminationCoreCalculations';
import { itCoreCalculations } from '../core/itCoreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { deltaResultReducer } from './getBudgetChartData';
import { getGlobalSummedYearlyFootprintDelta } from './getGlobalSummedYearlyFootprint';
import { getNetZero } from './getNetZero';

export function getActionPlanCardData(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: Array<SurveyAnswer>,
  realEstateId: string,
  actionAnswers: Array<ActionAnswerBase>,
) {
  const coreCalculations: IDataFrame<number, CategoryCoreCalculations> = new DataFrame([
    illuminationCoreCalculations,
    businessTravelCoreCalculations,
    electricityCoreCalculations,
    heatingCoreCalculations,
    itCoreCalculations,
  ]);

  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const actionAnswersDf = new DataFrame(actionAnswers);
  const netZero = getNetZero(externalCalculationData, surveyAnswers, realEstateId, actionAnswers);

  const actionPlanFootprintDelta = getGlobalSummedYearlyFootprintDelta(
    externalCalculationData,
    surveyAnswersDf,
    actionAnswersDf,
  );

  const categoryOriginalConstantCost = coreCalculations.map((coreCalculations) =>
    coreCalculations.getTotalSummedYearlyConstantCostsDelta(externalCalculationData, surveyAnswersDf, actionAnswersDf),
  );

  const originalConstantCost = categoryOriginalConstantCost.reduce<DeltaResult>(deltaResultReducer);

  return {
    netZero,
    actionPlanFootprintDelta,
    originalConstantCost,
  };
}
