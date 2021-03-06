import { IDataFrame, DataFrame } from 'data-forge';
import { ActionPlan } from '../../api/actionPlan';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { DeltaResult, getDeltaType } from '../../utils/deltaType';
import { businessTravelCoreCalculations } from '../core/businessTravelCoreCalculations';
import { CategoryCoreCalculations } from '../core/categoryCoreCalculations';
import { electricityCoreCalculations } from '../core/electricityCoreCalculations';
import { heatingCoreCalculations } from '../core/heatingCoreCalculations';
import { illuminationCoreCalculations } from '../core/illuminationCoreCalculations';
import { itCoreCalculations } from '../core/itCoreCalculations';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { linearizeActionPlanAnswers } from './utils';
export interface BudgetChartDataEntry {
  year: number;
  budget: number;
  profit: number;
  // categoryFootprintThisYear: Array<DeltaResult>;
  categoryInvestmentCostsThisYear: Array<number>;
  categoryOriginalConstantCost: Array<DeltaResult>;
  footprint: number;
  originalFootprint: number;
  footprintSavings: number;
  footprintSavingsPercent: number;
}

export const categories = ['Illumination', 'BusinessTravel', 'Electricity', 'Heating', 'IT'];

export function getBudgetChartData(
  externalCalculationData: ExternalCalculationData,
  actionPlans: Array<ActionPlan>,
  fromYear: number,
  toYear: number,
): Array<BudgetChartDataEntry> {
  const coreCalculations: IDataFrame<number, CategoryCoreCalculations> = new DataFrame([
    illuminationCoreCalculations,
    businessTravelCoreCalculations,
    electricityCoreCalculations,
    heatingCoreCalculations,
    itCoreCalculations,
  ]);

  // All action answers enriched with their start and end date, sorted by the time when they
  // start. The sorting ensures that they are applied in the correct order when transforming
  // survey answers.
  const linearizedActionAnswers = linearizeActionPlanAnswers(new DataFrame(actionPlans));

  // Using the imperative approach to calculate data for the corresponding years here because
  // certain data requires the results from the year(s) before. That doesn't work well with the
  // available functional alternatives like `map()`.
  const results: Array<BudgetChartDataEntry> = [];

  const originalFootprint = coreCalculations
    .map((coreCalculations) =>
      coreCalculations.getSummedYearlyFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame<number, ActionAnswerBase>(),
      ),
    )
    .reduce(deltaResultReducer);

  for (let year = fromYear; year <= toYear; year++) {
    const activeActionAnswers = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() <= year)
      .map((x) => x.answer);
    const activeActionAnswersLastLear = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() < year)
      .map((x) => x.answer);
    const activeActionAnswersThisYear = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() === year)
      .map((x) => x.answer);

    // Investment Costs:
    // The calculation here is complicated: We need to find the investment costs of *exactly those*
    // transformed survey answers that start in *this exact year*.
    // This means that we must diff the transformed survey answers of the previous year and this year.
    // *Only* those survey answers that changed require a reinvestment.
    const surveyAnswersLastYear = coreCalculations.flatMap((coreCalculations) =>
      coreCalculations.transformSurveyAnswers(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        activeActionAnswersLastLear,
      ),
    );

    const categoryInvestmentCostsThisYear = coreCalculations.map((coreCalculations) =>
      coreCalculations.getTotalSummedInvestmentCosts(
        externalCalculationData,
        surveyAnswersLastYear,
        activeActionAnswersThisYear,
      ),
    );

    const totalInvestmentCostsThisYear = categoryInvestmentCostsThisYear.reduce((result, cost) => result + cost, 0);

    const categoryOriginalConstantCost = coreCalculations.map((coreCalculations) =>
      coreCalculations.getTotalSummedYearlyConstantCostsDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        activeActionAnswers,
      ),
    );
    const originalConstantCost = categoryOriginalConstantCost.reduce<DeltaResult>(deltaResultReducer);

    const budgetRemainingFromLastYear = results[results.length - 1]?.budget ?? 0;
    const budgetNewThisYear = actionPlans
      .filter((actionPlan) => new Date(actionPlan.startDate).getFullYear() === year)
      .reduce((budget, actionPlan) => budget + actionPlan.budget, 0);

    const costs = originalConstantCost.delta + totalInvestmentCostsThisYear;
    const budget = budgetRemainingFromLastYear + budgetNewThisYear - costs;

    const categoryFootprintThisYear = coreCalculations.map((coreCalculations) =>
      coreCalculations.getSummedYearlyFootprint(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        activeActionAnswers,
      ),
    );

    const footprint = categoryFootprintThisYear.aggregate((a, b) => a + b);

    const footprintSavings = originalFootprint.after - footprint;

    const footprintSavingsPercent = Math.round((footprintSavings / originalFootprint.after) * 100 * 100) / 100;

    results.push({
      year,
      budget: Math.round(budget),
      profit: Math.round(-costs),
      footprint: footprint < 0 ? 0 : Math.round(footprint),
      originalFootprint: Math.round(originalFootprint.after),
      footprintSavings: Math.round(footprintSavings),
      footprintSavingsPercent: footprintSavingsPercent,
      // categoryFootprintThisYear: categoryFootprintThisYear.toArray(),
      categoryInvestmentCostsThisYear: categoryInvestmentCostsThisYear.toArray(),
      categoryOriginalConstantCost: categoryOriginalConstantCost.toArray(),
    });
  }

  return results;
}

export function deltaResultReducer(a: DeltaResult, b: DeltaResult) {
  return {
    after: a.after + b.after,
    before: a.before + b.before,
    delta: a.delta + b.delta,
    deltaType: getDeltaType(a.delta + b.delta),
  };
}
