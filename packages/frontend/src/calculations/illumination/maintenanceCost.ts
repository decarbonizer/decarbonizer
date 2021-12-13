import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { ExternalCalculationData } from '../externalData';
import { transformIlluminationSurveyAnswers } from './transformation';
import { getIlluminationRuntimePerYear } from './utils';

/**
 * Transforms **all given** illumination survey answers so that they integrate the given action answers
 * and then calculates their resulting cost.
 */
export function getTransformedIlluminationMaintenanceCostForYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  year: number,
) {
  const transformedAnswers = transformIlluminationSurveyAnswers(surveyAnswers, actionAnswers);
  return getIlluminationMaintenanceCostForYear(externalCalculationData, transformedAnswers, year);
}

/**
 * Calculates the cost of **all given** illumination survey answers.
 */
export function getIlluminationMaintenanceCostForYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, IlluminationSurveyAnswerValue>,
  year: number,
) {
  return surveyAnswers
    .map((answer) => getIlluminationMaintenanceCostForYearForSingleSurveyAnswer(externalCalculationData, answer, year))
    .aggregate((a, b) => a + b);
}

function getIlluminationMaintenanceCostForYearForSingleSurveyAnswer(
  externalCalculationData: ExternalCalculationData,
  answer: IlluminationSurveyAnswerValue,
  year: number,
) {
  const { requiredReplacementsPerYear, costOnReplace } = getIlluminationMaintenanceCostForSingleSurveyAnswer(
    externalCalculationData,
    answer,
  );

  let replacements = requiredReplacementsPerYear;
  for (let currentYear = 1; currentYear < year; currentYear++) {
    replacements -= Math.floor(replacements);
    replacements += requiredReplacementsPerYear;
  }

  const replacementsThisYear = Math.floor(replacements);
  // console.info(replacementsThisYear * costOnReplace, replacementsThisYear, costOnReplace);
  return replacementsThisYear * costOnReplace;
}

/**
 * Calculates the maintenance cost of **one** illumination survey answer.
 */
function getIlluminationMaintenanceCostForSingleSurveyAnswer(
  { bulbs }: ExternalCalculationData,
  answer: IlluminationSurveyAnswerValue,
) {
  const avgElectritianWagePerHour = 12.0; // Minimum wage in Germany as of soon. :^)
  const avgElectritianWagePerBulb = avgElectritianWagePerHour / 6; // assume that it takes 10 min to change a bulb

  const bulb = bulbs.filter((bulb) => bulb._id === answer.bulbType).first();
  const runtimeInHoursPerYear = getIlluminationRuntimePerYear(answer);
  const runtimeInHoursPerYearPerBulb = runtimeInHoursPerYear / answer.lampCount;
  const requiredReplacementsPerYear = runtimeInHoursPerYearPerBulb / bulb.lifetimeInHours;
  const costOnReplace = answer.lampCount * bulb.costInEuro + answer.lampCount * avgElectritianWagePerBulb;

  return {
    requiredReplacementsPerYear,
    costOnReplace,
  };
}
