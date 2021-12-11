import { IDataFrame } from 'data-forge';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { ExternalCalculationData } from '../externalData';

/**
 * Calculates the CO2 footprint of all the given illumination survey answers.
 */
export function getIlluminationFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, IlluminationSurveyAnswerValue>,
) {
  return surveyAnswers
    .map((answer) => getIlluminationFootprintPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the CO2 footprint of one illumination survey answer.
 */
function getIlluminationFootprintPerYearForSingleSurveyAnswer(
  { bulbs }: ExternalCalculationData,
  answer: IlluminationSurveyAnswerValue,
) {
  const germanyEF = 0.624;
  const bulb = bulbs.filter((bulb) => bulb._id === answer.bulbType).first();
  const runtimeInHoursPerYear = answer.avgIlluminationPerDay * answer.avgIlluminationPerYear;
  const footprint = bulb.productionKwh * runtimeInHoursPerYear * germanyEF + answer.lampCount;
  return footprint;
}
