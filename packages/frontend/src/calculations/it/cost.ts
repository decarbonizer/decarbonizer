import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformItSurveyAnswers } from './transformation';

/**
 * Returns the cost delta of a set of illumination survey answers before and after applying the given actions.
 */
export function getItCostDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const itSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'it');
  const originalCost = getItCostPerYear(
    externalCalculationData,
    itSurveyAnswers.map((answer) => answer.value),
  );

  const costAfterActions = getTransformedItCostPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = costAfterActions - originalCost;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
    originalCost,
    costAfterActions,
  };
}

/**
 * Transforms **all given** illumination survey answers so that they integrate the given action answers
 * and then calculates their resulting cost.
 */
export function getTransformedItCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformItSurveyAnswers(surveyAnswers, actionAnswers);
  return getItCostPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the cost of **all given** illumination survey answers.
 */
export function getItCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, ItSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getItCostPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the cost of **one** illumination survey answer.
 */
function getItCostPerYearForSingleSurveyAnswer({ energyForms }: ExternalCalculationData, answer: ItSurveyAnswerValue) {
  const energyForm = energyForms.filter((energyForm) => energyForm._id === answer.dataCenterEnergyForm).first();
  return answer.superServer
    ? energyForm.euroPerKwh * answer.dataCenterConsumption * 0.3
    : energyForm.euroPerKwh * answer.dataCenterConsumption;
}
