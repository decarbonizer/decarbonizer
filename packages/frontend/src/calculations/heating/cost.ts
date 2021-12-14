import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformHeatingSurveyAnswers } from './transformation';

/**
 * Returns the cost delta of a set of heating survey answers before and after applying the given actions.
 */
export function getHeatingCostDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const heatingSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'heating');
  const originalCost = getHeatingCostPerYear(
    externalCalculationData,
    heatingSurveyAnswers.map((answer) => answer.value),
  );

  const costAfterActions = getTransformedHeatingCostPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = costAfterActions - originalCost;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
  };
}

/**
 * Transforms **all given** heating survey answers so that they integrate the given action answers
 * and then calculates their resulting cost.
 */
export function getTransformedHeatingCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformHeatingSurveyAnswers(surveyAnswers, actionAnswers);
  return getHeatingCostPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the cost of **all given** heating survey answers.
 */
export function getHeatingCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, HeatingSurveyAnswerValue>,
) {
  return surveyAnswers
    .map((answer) => getHeatingCostPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the cost of **one** heating survey answer.
 */
function getHeatingCostPerYearForSingleSurveyAnswer(
  { energyForms, realEstates, heatingTypes }: ExternalCalculationData,
  answer: HeatingSurveyAnswerValue,
) {
  const energyForm = energyForms.filter((form) => form._id === answer.radiatorKind).first();
  //const realEstate = realEstates.filter((realEstate) => realEstate.cityName=== answer.realEstateName).first();
  const heatingType = heatingTypes.filter((heatingType) => heatingType._id === answer.radiatorKind).first();
  const avgHeatingPerYearHours = answer.avgHeatingPerYear * 24;
  const heatingKwhPerQm = 0.1;
  const energyFormCost = energyForm.euroPerKwh * heatingType.consumptionKwh;

  return heatingKwhPerQm * avgHeatingPerYearHours;
}
