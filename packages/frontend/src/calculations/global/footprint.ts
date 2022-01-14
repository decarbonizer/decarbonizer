import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getTransformedHeatingFootprintPerYear } from '../heating/footprint';
import { getTransformedIlluminationFootprintPerYear } from '../illumination/footprint';
import { getTransformedElectricityFootprintPerYear } from '../electricity/footprint';
import { getTransformedBusinessTravelFootprintPerYear } from '../businessTravel/footprint';

export function getFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const originalFootprint = getTransformedFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    new DataFrame<number, ActionAnswerBase>(),
  ).globalFootprint;

  const footprintAfterActions = getTransformedFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  ).globalFootprint;

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    delta,
    deltaType,
    originalFootprint,
    footprintAfterActions,
  };
}

/**
 * Transforms **all given** survey answers so that they integrate the given action answers
 * and then calculates the global footprint.
 */
export function getTransformedFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const electricityFootprint = getTransformedElectricityFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );
  const illuminationFootprint = getTransformedIlluminationFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );

  const heatingFootprint = getTransformedHeatingFootprintPerYear(externalCalculationData, surveyAnswers, actionAnswers);
  const businessTravelFootprint = getTransformedBusinessTravelFootprintPerYear(
    externalCalculationData,
    surveyAnswers,
    actionAnswers,
  );

  // TODO: Sum other footprints that are added in the future.
  const globalFootprint = illuminationFootprint + heatingFootprint + electricityFootprint + businessTravelFootprint;

  return {
    globalFootprint,
    electricityFootprint,
    illuminationFootprint,
    heatingFootprint,
  };
}
