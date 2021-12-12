import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformIlluminationSurveyAnswers } from './transformation';

/**
 * Returns the CO2 footprint delta of a set of illumination survey answers before and after applying the given actions.
 */
export function getIlluminationFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const illuminationSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'illumination');
  const originalFootprint = getIlluminationFootprintPerYear(
    externalCalculationData,
    illuminationSurveyAnswers.map((answer) => answer.value),
  );

  const footprintAfterActions = getTransformedIlluminationFootprintPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
  };
}

/**
 * Transforms **all given** illumination survey answers so that they integrate the given action answers
 * and then calculates their resulting CO2 footprint.
 */
export function getTransformedIlluminationFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformIlluminationSurveyAnswers(surveyAnswers, actionAnswers);
  return getIlluminationFootprintPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the CO2 footprint of **all given** illumination survey answers.
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
 * Calculates the CO2 footprint of **one** illumination survey answer.
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
