import { IDataFrame, DataFrame } from 'data-forge';
import isEqual from 'lodash-es/isEqual';
import { ActionPlan } from '../api/actionPlan';
import { ExternalCalculationData } from '../calculations/externalData';
import { ChooseTimePeriodElementAnswerValue } from '../data/actions/shared/chooseTimePeriodElement';
import { DeltaResult, getDeltaType } from '../utils/deltaType';
import { CategoryCoreCalculations } from './core/categoryCoreCalculations';
import { illuminationCoreCalculations } from './core/illuminationCoreCalculations';

export interface BudgetChartDataEntry {
  year: number;
  budget: number;
  footprint: number;
}

export function getBudgetChartData(
  externalCalculationData: ExternalCalculationData,
  actionPlans: IDataFrame<number, ActionPlan>,
  fromYear: number,
  toYear: number,
): Array<BudgetChartDataEntry> {
  const coreCalculations: IDataFrame<number, CategoryCoreCalculations> = new DataFrame([illuminationCoreCalculations]);

  // All action answers enriched with their start and end date, sorted by the time when they
  // start. The sorting ensures that they are applied in the correct order when transforming
  // survey answers.
  const linearizedActionAnswers = actionPlans
    .flatMap((actionPlan) =>
      actionPlan.actionAnswers.map((answer) => {
        const detailsValue = (answer.values.detailsValue ?? {}) as ChooseTimePeriodElementAnswerValue;
        const startDate = new Date(detailsValue.timePeriod?.startDate ?? actionPlan.startDate);
        const endDate = new Date(detailsValue.timePeriod?.endDate ?? actionPlan.endDate);

        return {
          actionPlan,
          answer,
          startDate,
          endDate,
        };
      }),
    )
    .orderBy((x) => x.startDate)
    .thenBy((x) => x.endDate);

  // Using the imperative approach to calculate data for the corresponding years here because
  // certain data requires the results from the year(s) before. That doesn't work well with the
  // available functional alternatives like `map()`.
  const results: Array<BudgetChartDataEntry> = [];

  for (let year = fromYear; year <= toYear; year++) {
    const activeActionAnswers = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() <= year)
      .map((x) => x.answer);
    const activeActionAnswersLastLear = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() < year)
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
    const surveyAnswersThisYear = coreCalculations.flatMap((coreCalculations) =>
      coreCalculations.transformSurveyAnswers(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        activeActionAnswers,
      ),
    );
    const surveyAnswersWhichChangedThisYear = surveyAnswersThisYear.filter(
      (surveyAnswer) =>
        !surveyAnswersLastYear.any(
          (oldSurveyAnswer) =>
            surveyAnswer._id === oldSurveyAnswer._id && isEqual(surveyAnswer.value, oldSurveyAnswer.value),
        ),
    );
    const totalInvestmentCostsThisYear = coreCalculations
      .map((coreCalculations) =>
        coreCalculations.getTotalSummedInvestmentCosts(externalCalculationData, surveyAnswersWhichChangedThisYear),
      )
      .reduce((result, cost) => result + cost, 0);

    const originalConstantCost = coreCalculations
      .map((coreCalculations) =>
        coreCalculations.getTotalYearlyConstantCostsDelta(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          activeActionAnswers,
        ),
      )
      .reduce<DeltaResult>(deltaResultReducer);

    const budgetRemainingFromLastYear = results[results.length - 1]?.budget ?? 0;
    const budgetNewThisYear = actionPlans
      .filter((actionPlan) => new Date(actionPlan.startDate).getFullYear() === year)
      .reduce((budget, actionPlan) => budget + actionPlan.budget, 0);
    const budget =
      budgetRemainingFromLastYear + budgetNewThisYear + -originalConstantCost.delta - totalInvestmentCostsThisYear;

    const footprint = coreCalculations
      .map((coreCalculations) =>
        coreCalculations.getSummedYearlyFootprintDelta(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          activeActionAnswers,
        ),
      )
      .reduce(deltaResultReducer);

    results.push({
      year,
      budget: Math.round(budget),
      footprint: Math.round(footprint.after),
    });
  }

  return results;
}

function deltaResultReducer(a: DeltaResult | undefined, b: DeltaResult) {
  return {
    after: a?.after ?? 0 + b.after,
    before: a?.before ?? 0 + b.before,
    delta: a?.delta ?? 0 + b.delta,
    deltaType: getDeltaType((a?.delta ?? 0) + b.delta),
  };
}
