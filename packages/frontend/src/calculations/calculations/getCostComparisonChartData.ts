import { DataFrame } from 'data-forge';
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

  return range(1, toYear).map((year) => {
    const totalSummedYearlyChangingCosts = coreCalculations.getTotalSummedYearlyChangingCostsDelta(
      externalCalculationData,
      surveyAnswersDf,
      transformingActionAnswersDf,
      year,
    );

    const totalConstantCostsBefore = Math.round(year * totalSummedYearlyConstantCosts.before);
    const totalConstantCostsAfter = Math.round(year * totalSummedYearlyConstantCosts.after);
    const totalChangingCostsBefore = Math.round(totalSummedYearlyChangingCosts.before);
    const totalChangingCostsAfter = Math.round(totalSummedYearlyChangingCosts.after);
    const totalCostsBefore = totalConstantCostsBefore + totalChangingCostsBefore;
    const totalCostsAfter = totalConstantCostsAfter + totalChangingCostsAfter;

    return {
      year: year,
      totalConstantCostsBefore,
      totalConstantCostsAfter,
      totalChangingCostsBefore,
      totalChangingCostsAfter,
      totalCostsBefore,
      totalCostsAfter,
    };
  });
}
