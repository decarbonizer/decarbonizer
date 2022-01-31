import { DataFrame, Series } from 'data-forge';
import range from 'lodash-es/range';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { categoryCoreCalculationsMap, KnownCategoryCoreCalculationsId } from '../core/coreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export function getCostComparisonCardData(
  externalCalculationData: ExternalCalculationData,
  category: KnownCategoryCoreCalculationsId,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionAnswers: Array<ActionAnswerBase>,
  toYear: number,
) {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers);
  const coreCalculations = categoryCoreCalculationsMap[category];

  const years = new Series(range(1, toYear));
  const totalSummedYearlyConstantCosts = coreCalculations.getTotalSummedYearlyConstantCostsDelta(
    externalCalculationData,
    surveyAnswersDf,
    transformingActionAnswersDf,
  );
  const totalSummedInvestmentCosts = coreCalculations.getTotalSummedInvestmentCosts(
    externalCalculationData,
    surveyAnswersDf,
    transformingActionAnswersDf,
  );
  const totalSummedYearlyChangingCostsPerYear = years.map((year) =>
    coreCalculations.getTotalSummedYearlyChangingCostsDelta(
      externalCalculationData,
      surveyAnswersDf,
      transformingActionAnswersDf,
      year,
    ),
  );
  const totalCostsBeforePerYear = totalSummedYearlyChangingCostsPerYear.map(
    (changingCost) => changingCost.before + totalSummedYearlyConstantCosts.before,
  );
  const totalCostsAfterPerYear = totalSummedYearlyChangingCostsPerYear.map(
    (changingCost) => changingCost.after + totalSummedYearlyConstantCosts.after,
  );

  return years
    .map((year) => ({
      year: year,
      totalCostsBefore: Math.round(totalCostsBeforePerYear.take(year).sum()),
      totalCostsAfter: Math.round(totalCostsAfterPerYear.take(year).sum() + totalSummedInvestmentCosts),
      totalConstantCostsBefore: Math.round(totalSummedYearlyConstantCosts.before * year),
      totalConstantCostsAfter: Math.round(totalSummedYearlyConstantCosts.after * year),
      totalChangingCostsBefore: Math.round(
        totalSummedYearlyChangingCostsPerYear
          .take(year)
          .map((x) => x.before)
          .sum(),
      ),
      totalChangingCostsAfter: Math.round(
        totalSummedYearlyChangingCostsPerYear
          .take(year)
          .map((x) => x.after)
          .sum() + totalSummedInvestmentCosts,
      ),
    }))
    .toArray();
}
