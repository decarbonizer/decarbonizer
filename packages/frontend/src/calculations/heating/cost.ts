import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
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
    originalCost,
    costAfterActions,
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
 * Transforms **all given** heating survey answers so that they integrate the given action answers
 * and then calculates their resulting installation cost.
 */
export function getTransformedHeatingInstallationCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformHeatingSurveyAnswers(surveyAnswers, actionAnswers);
  return getHeatingInstallationCostPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the cost of **all given** heating survey answers.
 */
export function getHeatingCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, HeatingSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }

  return surveyAnswers
    .map((answer) => getHeatingCostPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the installation cost of **all given** heating survey answers.
 */
export function getHeatingInstallationCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, HeatingSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }

  return surveyAnswers
    .map((answer) => getHeatingInstallationCostForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the cost of **one** heating survey answer.
 */
function getHeatingCostPerYearForSingleSurveyAnswer(
  { energyForms, heatingTypes }: ExternalCalculationData,
  answer: HeatingSurveyAnswerValue,
) {
  const energyForm = energyForms.filter((form) => form._id === answer.radiatorKind).first();
  const heatingType = heatingTypes.filter((heatingType) => heatingType._id === answer.radiatorKind).first();

  const avgHeatingPerYearHours = answer.avgHeatingPerYear * 8; //assume heating is 8 hours on
  const heatingKwhPerQm = 0.1;

  let overallkWhForHeating = heatingKwhPerQm * answer.realEstateAreaInQm;

  if (answer.smartThermostats) {
    overallkWhForHeating = overallkWhForHeating * 0.9;
  }

  const overallkWhConsumptionForEnergyForm =
    (overallkWhForHeating / heatingType.productionKwh) * heatingType.consumptionKwh;

  const energyFormCost = energyForm.euroPerKwh * overallkWhConsumptionForEnergyForm * avgHeatingPerYearHours;

  return energyFormCost;
}

/**
 * Calculates the installation cost of **one** heating survey answer.
 */
function getHeatingInstallationCostForSingleSurveyAnswer(
  { heatingTypes }: ExternalCalculationData,
  answer: HeatingSurveyAnswerValue,
) {
  const heatingType = heatingTypes.filter((heatingType) => heatingType._id === answer.radiatorKind).first();
  const heatingKwhPerQm = 0.1;
  const installationCostInEuro =
    answer.radiatorKind === '00000000-0000-0000-0000-000000000000'
      ? ((heatingKwhPerQm * answer.realEstateAreaInQm * 8) / 4) * heatingType.installationCostInEuro
      : heatingType.installationCostInEuro;
  return installationCostInEuro;
}
