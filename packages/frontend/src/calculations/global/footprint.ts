import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../externalData';
import { getTransformedIlluminationFootprintPerYear } from '../illumination/footprint';
import { getTransformedElectricityFootprintPerYear } from '../electricity/footprint';

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

  // TODO: Sum other footprints that are added in the future.
  const globalFootprint = electricityFootprint + illuminationFootprint;

  return {
    globalFootprint,
    electricityFootprint,
    illuminationFootprint,
  };
}
