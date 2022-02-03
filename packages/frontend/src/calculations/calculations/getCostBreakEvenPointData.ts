import { DataFrame, Series, range } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { KnownCategoryCoreCalculationsId, categoryCoreCalculationsMap } from '../core/coreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export function getCostBreakEvenPointData(
  externalCalculationData: ExternalCalculationData,
  category: KnownCategoryCoreCalculationsId,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionAnswers: Array<ActionAnswerBase>,
) {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers);
  const coreCalculations = categoryCoreCalculationsMap[category];

  const totalSummedInvestmentCosts = coreCalculations.getTotalSummedInvestmentCosts(
    externalCalculationData,
    surveyAnswersDf,
    transformingActionAnswersDf,
  );

  let breakEvenYear = 1;
  let breakEvenYears = new Series(range(1, breakEvenYear));
  let breakEvenCostOld = 0;
  let breakEvenCostNew = totalSummedInvestmentCosts;

  while (breakEvenCostOld < breakEvenCostNew) {
    breakEvenYear++;
    breakEvenYears = new Series(range(1, breakEvenYear));

    breakEvenCostOld = breakEvenYears
      .map((year) =>
        coreCalculations.getTotalSummedYearlyChangingCostsDelta(
          externalCalculationData,
          surveyAnswersDf,
          transformingActionAnswersDf,
          year,
        ),
      )
      .map((x) => x.before)
      .sum();

    breakEvenCostNew =
      breakEvenYears
        .map((year) =>
          coreCalculations.getTotalSummedYearlyChangingCostsDelta(
            externalCalculationData,
            surveyAnswersDf,
            transformingActionAnswersDf,
            year,
          ),
        )
        .map((x) => x.after)
        .sum() + totalSummedInvestmentCosts;
  }

  return {
    breakEvenYear: breakEvenYear,
    breakEvenCostOld: Math.round(breakEvenCostOld),
    breakEvenCostNew: Math.round(breakEvenCostNew),
  };
}
