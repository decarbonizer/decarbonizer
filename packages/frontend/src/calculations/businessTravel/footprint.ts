import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { BusinessTravelSurveyAnswerValue } from '../../data/surveys/businessTravel/businessTravelSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformBusinessTravelSurveyAnswers } from './transformation';

/**
 * Returns the CO2 footprint delta of a set of business travel survey answers before and after applying the given actions.
 */
export function getBusinessTravelFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const businessTravelSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'businessTravel');
  const originalFootprint = getBusinessTravelFootprintPerYear(
    externalCalculationData,
    businessTravelSurveyAnswers.map((answer) => answer.value),
  );

  const footprintAfterActions = getTransformedBusinessTravelFootprintPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    originalFootprint,
    footprintAfterActions,
    delta,
    deltaType,
  };
}

/**
 * Transforms **all given** business travel survey answers so that they integrate the given action answers
 * and then calculates their resulting CO2 footprint.
 */
export function getTransformedBusinessTravelFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformBusinessTravelSurveyAnswers(surveyAnswers, actionAnswers);
  return getBusinessTravelFootprintPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the CO2 footprint of **all given** business travel survey answers.
 */
export function getBusinessTravelFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, BusinessTravelSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getBusinessTravelFootprintPerYearForSingleSurveyAnswer(answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the CO2 footprint of **one** business travel survey answer.
 */
function getBusinessTravelFootprintPerYearForSingleSurveyAnswer(answer: BusinessTravelSurveyAnswerValue) {
  const shortTravelEmissionsPerKm = 0.15353;
  const longTravelEmissionsPerKm = 0.19309;

  return answer.shortTraveling * shortTravelEmissionsPerKm + answer.longTraveling * longTravelEmissionsPerKm;
}
