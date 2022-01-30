import { DataFrame } from 'data-forge';
import range from 'lodash-es/range';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { categoryCoreCalculationsMap, KnownCategoryCoreCalculationsId } from '../core/coreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export function getFootprintComparisonCardData(
  externalCalculationData: ExternalCalculationData,
  category: KnownCategoryCoreCalculationsId,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionAnswers: Array<ActionAnswerBase>,
  toYear: number,
) {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers);
  const coreCalculations = categoryCoreCalculationsMap[category];

  const summedYearlyFootprintDelta = coreCalculations.getSummedYearlyFootprintDelta(
    externalCalculationData,
    surveyAnswersDf,
    transformingActionAnswersDf,
  );

  return range(1, toYear).map((year) => ({
    year: year,
    before: Math.round(year * summedYearlyFootprintDelta.before),
    after: Math.round(year * summedYearlyFootprintDelta.after),
  }));
}
