import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToHeatPumpActionAnswerValue,
  SwitchToHeatPumpActionDetailsAnswerValue,
} from '../../data/actions/heating/switchToHeatPumpAction';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../externalData';
import { getTransformedProducedHeatingPerYear } from '../it/footprint';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { transformHeatingSurveyAnswers } from './transformation';

/**
 * Returns id of heating type which reduces Co2 the most.
 */
export function getSuggestionForSwitchToHeatPumpFootprint(externalCalculationData: ExternalCalculationData) {
  const result = externalCalculationData.heatingTypes.reduce<{ difference: number; heatingTypeId: string | undefined }>(
    ({ difference, heatingTypeId }, heatingType) => {
      const newHeatPump: SwitchToHeatPumpActionAnswerValue = { newHeatPump: heatingType._id };
      const possibleAnswerValue: ActionAnswerValues<
        SwitchToHeatPumpActionAnswerValue,
        SwitchToHeatPumpActionDetailsAnswerValue
      > = { value: newHeatPump, detailsValue: undefined };
      const possibleAction: ActionAnswerBase<ActionAnswerValues> = {
        actionId: 'switchToHeatPump',
        values: possibleAnswerValue,
      };
      const result = getHeatingFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame([possibleAction]),
      );

      return result.delta < difference
        ? { difference: result.delta, heatingTypeId: heatingType._id }
        : { difference: difference, heatingTypeId: heatingTypeId };
    },
    { difference: 0, heatingTypeId: undefined },
  );
  return { newHeatPump: result.heatingTypeId };
}

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
    0,
  );

  const producedHeatingAfterActionsInKwh = getTransformedProducedHeatingPerYear(
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const footprintAfterActions = getTransformedHeatingFootprintPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
    producedHeatingAfterActionsInKwh,
  );

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    originalFootprint,
    footprintAfterActions,
    delta,
    deltaType,
    producedHeatingAfterActionsInKwh,
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
  producedHeatingInKwh?: number,
) {
  const transformedAnswers = transformHeatingSurveyAnswers(surveyAnswers, actionAnswers);
  if (producedHeatingInKwh == null) {
    producedHeatingInKwh = getTransformedProducedHeatingPerYear(surveyAnswers, actionAnswers);
  }
  return getHeatingFootprintPerYear(externalCalculationData, transformedAnswers, producedHeatingInKwh);
}
/**
 * Calculates the CO2 footprint of **all given** heating survey answers.
 */
export function getHeatingFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, HeatingSurveyAnswerValue>,
  producedHeatingInKwh?: number,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  if (producedHeatingInKwh == null) {
    return surveyAnswers
      .map((answer) => {
        const result = getHeatingFootprintPerYearForSingleSurveyAnswer(externalCalculationData, answer, 0);
        return result.footprint;
      })
      .aggregate((a, b) => a + b);
  } else {
    let availableHeatingInKwh = producedHeatingInKwh;
    return surveyAnswers
      .map((answer) => {
        const result = getHeatingFootprintPerYearForSingleSurveyAnswer(
          externalCalculationData,
          answer,
          availableHeatingInKwh,
        );
        availableHeatingInKwh = result.availableHeatingInKwh; //use produced heating that is left

        return result.footprint;
      })
      .aggregate((a, b) => a + b);
  }
}

/**
 * Calculates the CO2 footprint of **one** heating survey answer.
 */
function getHeatingFootprintPerYearForSingleSurveyAnswer(
  { energyForms, heatingTypes }: ExternalCalculationData,
  answer: HeatingSurveyAnswerValue,
  availableHeatingInKwh: number,
): { footprint: number; availableHeatingInKwh: number } {
  const heatingKwhRequiredPerQm = 0.1;
  const heatingType = heatingTypes.filter((heatingType) => heatingType._id === answer.radiatorKind).first();
  const energyForm = energyForms.filter((form) => form._id === heatingType._id).first();

  let overallkWhRequiredForHeating = heatingKwhRequiredPerQm * answer.realEstateAreaInQm;

  // take produced heating through it into consideration
  let heatingLeftInKwh = availableHeatingInKwh;
  if (availableHeatingInKwh >= overallkWhRequiredForHeating) {
    heatingLeftInKwh -= overallkWhRequiredForHeating;
    return { footprint: 0, availableHeatingInKwh: heatingLeftInKwh }; //all heating is compensated by it
  } else {
    overallkWhRequiredForHeating -= availableHeatingInKwh;
  }

  if (answer.smartThermostats) {
    overallkWhRequiredForHeating *= 0.9;
  }

  let overallkWhConsumptionForEnergyForm = overallkWhRequiredForHeating / heatingType.productionKwh;

  if (heatingType.consumptionKwh !== 0) {
    overallkWhConsumptionForEnergyForm *= heatingType.consumptionKwh;
  }

  const footprint =
    (energyForm.co2PerGramPerKwh / 1000) * overallkWhConsumptionForEnergyForm * 8 * answer.avgHeatingPerYear; //asume heating is 8 hours on

  return { footprint: footprint, availableHeatingInKwh: heatingLeftInKwh };
}
