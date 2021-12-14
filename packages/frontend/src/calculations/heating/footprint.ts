import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { RealEstate } from '../../api/realEstate';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformHeatingSurveyAnswers } from './transformation';

/**
 * Returns the CO2 footprint delta of a set of heating survey answers before and after applying the given actions.
 */
export function getHeatingFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const heatingSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'heating');
  const originalFootprint = getHeatingFootprintPerYear(
    externalCalculationData,
    heatingSurveyAnswers.map((answer) => answer.value),
  );
  console.log(originalFootprint);

  const footprintAfterActions = getTransformedHeatingFootprintPerYear(
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
 * Transforms **all given** heating survey answers so that they integrate the given action answers
 * and then calculates their resulting CO2 footprint.
 */
export function getTransformedHeatingFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformHeatingSurveyAnswers(surveyAnswers, actionAnswers);
  return getHeatingFootprintPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the CO2 footprint of **all given** heating survey answers.
 */
export function getHeatingFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, HeatingSurveyAnswerValue>,
) {
  return surveyAnswers
    .map((answer) => getHeatingFootprintPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the CO2 footprint of **one** heating survey answer.
 */
function getHeatingFootprintPerYearForSingleSurveyAnswer(
  { energyForms, heatingTypes }: ExternalCalculationData,
  answer: HeatingSurveyAnswerValue,
) {
  const heatingKwhPerQm = 0.1;

  const heatingType = heatingTypes.filter((heatingType) => heatingType._id == answer.radiatorKind).first();
  const energyForm = energyForms.filter((form) => form._id === heatingType._id).first();
  const overallkWhForHeating = heatingKwhPerQm * 2000; //area is 2000
  let overallkWhConsumptionForEnergyForm =
    (overallkWhForHeating / heatingType.productionKwh) * heatingType.consumptionKwh;

  if (answer.smartThermostats) {
    overallkWhConsumptionForEnergyForm = overallkWhConsumptionForEnergyForm * 0.9;
  }

  const footprint = (energyForm.co2PerGramPerKwh / 1000) * overallkWhConsumptionForEnergyForm;
  console.log(footprint);
  return footprint;
}
