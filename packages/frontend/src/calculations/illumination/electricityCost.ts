import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  ChangeBulbsActionAnswerValue,
  ChangeBulbsActionDetailsAnswerValue,
} from '../../data/actions/illumination/changeBulbsAction';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformIlluminationSurveyAnswers } from './transformation';
import { getIlluminationRuntimePerYear } from './utils';

/**
 * Returns id of bulb which reduces costs the most.
 */
export function getSuggestionForChangeBulbsCost(externalCalculationData: ExternalCalculationData) {
  const result = externalCalculationData.bulbs.reduce<{ difference: number; bulbId: string | undefined }>(
    ({ difference, bulbId }, bulb) => {
      const newBulb: ChangeBulbsActionAnswerValue = { newBulb: bulb._id };
      const possibleAnswerValue: ActionAnswerValues<ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue> =
        { value: newBulb, detailsValue: undefined };
      const possibleAction: ActionAnswerBase<ActionAnswerValues> = {
        actionId: 'changeBulbs',
        values: possibleAnswerValue,
      };
      const result = getIlluminationElectricityCostDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame([possibleAction]),
      );

      return result.delta < difference
        ? { difference: result.delta, bulbId: bulb._id }
        : { difference: difference, bulbId: bulbId };
    },
    { difference: 0, bulbId: undefined },
  );
  return { newBulb: result.bulbId };
}

/**
 * Returns the cost delta of a set of illumination survey answers before and after applying the given actions.
 */
export function getIlluminationElectricityCostDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const illuminationSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'illumination');
  const originalCost = getIlluminationElectricityCostPerYear(
    externalCalculationData,
    illuminationSurveyAnswers.map((answer) => answer.value),
  );

  const costAfterActions = getTransformedIlluminationElectricityCostPerYear(
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
export function getTransformedIlluminationElectricityCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformIlluminationSurveyAnswers(surveyAnswers, actionAnswers);
  return getIlluminationElectricityCostPerYear(externalCalculationData, transformedAnswers);
}

/**
 * Calculates the cost of **all given** illumination survey answers.
 */
export function getIlluminationElectricityCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, IlluminationSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getIlluminationElectricityCostPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

/**
 * Calculates the cost of **one** illumination survey answer.
 */
function getIlluminationElectricityCostPerYearForSingleSurveyAnswer(
  { bulbs }: ExternalCalculationData,
  answer: IlluminationSurveyAnswerValue,
) {
  const bulb = bulbs.filter((bulb) => bulb._id === answer.bulbType).first();
  const energyForm = { euroPerKwh: 0.25 }; // TODO: Extract from data.
  const runtimeInHoursPerYear = getIlluminationRuntimePerYear(answer);
  return answer.lampCount * (bulb.productionKwh * energyForm.euroPerKwh * runtimeInHoursPerYear);
}
