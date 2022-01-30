import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { KnownActionId, ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';
import {
  SwitchToHeatPumpActionAnswerValue,
  SwitchToHeatPumpActionDetailsAnswerValue,
} from '../../data/actions/heating/switchToHeatPumpAction';
import {
  ChangeBulbsActionAnswerValue,
  ChangeBulbsActionDetailsAnswerValue,
} from '../../data/actions/illumination/changeBulbsAction';
import { electricityCoreCalculations } from '../core/electricityCoreCalculations';
import { heatingCoreCalculations } from '../core/heatingCoreCalculations';
import { illuminationCoreCalculations } from '../core/illuminationCoreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export function getSuggestionForFootprint(externalCalculationData: ExternalCalculationData, actionId: KnownActionId) {
  switch (actionId) {
    case 'changeBulbs':
      return getSuggestionForChangeBulbsFootprint(externalCalculationData);
    case 'switchToHeatPump':
      return getSuggestionForSwitchToHeatPumpFootprint(externalCalculationData);
    case 'switchToGreenEnergy':
      return getSuggestionForSwitchToGreenEnergyFootprint(externalCalculationData);
    default:
      break;
  }
}

export function getSuggestionForCost(externalCalculationData: ExternalCalculationData, actionId: KnownActionId) {
  switch (actionId) {
    case 'changeBulbs':
      return getSuggestionForChangeBulbsCost(externalCalculationData);
    case 'switchToHeatPump':
      return getSuggestionForSwitchToHeatPumpCost(externalCalculationData);
    case 'switchToGreenEnergy':
      return getSuggestionForSwitchToGreenEnergyCost(externalCalculationData);
    default:
      break;
  }
}

/**
 * Returns id of energy form which reduces costs the most.
 */
export function getSuggestionForSwitchToGreenEnergyCost(externalCalculationData: ExternalCalculationData) {
  const result = externalCalculationData.energyForms.reduce<{ difference: number; energyFormId: string | undefined }>(
    ({ difference, energyFormId }, energyForm) => {
      const newEnergyForm: SwitchToGreenEnergyActionAnswerValue = { newEnergyForm: energyForm._id };
      const possibleAnswerValue: ActionAnswerValues<
        SwitchToGreenEnergyActionAnswerValue,
        SwitchToGreenEnergyDetailsAnswerValue
      > = { value: newEnergyForm, detailsValue: undefined };
      const possibleAction: ActionAnswerBase<ActionAnswerValues> = {
        actionId: 'switchToGreenEnergy',
        values: possibleAnswerValue,
      };
      const result = electricityCoreCalculations.getTotalSummedYearlyConstantCostsDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame([possibleAction]),
      );

      return result.delta < difference
        ? { difference: result.delta, energyFormId: energyForm._id }
        : { difference: difference, energyFormId: energyFormId };
    },
    { difference: 0, energyFormId: undefined },
  );
  return { newEnergyForm: result.energyFormId };
}

/**
 * Returns id of energy form which reduces Co2 the most.
 */
export function getSuggestionForSwitchToGreenEnergyFootprint(externalCalculationData: ExternalCalculationData) {
  const result = externalCalculationData.energyForms.reduce<{ difference: number; energyFormId: string | undefined }>(
    ({ difference, energyFormId }, energyForm) => {
      const newEnergyForm: SwitchToGreenEnergyActionAnswerValue = { newEnergyForm: energyForm._id };
      const possibleAnswerValue: ActionAnswerValues<
        SwitchToGreenEnergyActionAnswerValue,
        SwitchToGreenEnergyDetailsAnswerValue
      > = { value: newEnergyForm, detailsValue: undefined };
      const possibleAction: ActionAnswerBase<ActionAnswerValues> = {
        actionId: 'switchToGreenEnergy',
        values: possibleAnswerValue,
      };
      const result = electricityCoreCalculations.getSummedYearlyFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame([possibleAction]),
      );

      return result.delta < difference
        ? { difference: result.delta, energyFormId: energyForm._id }
        : { difference: difference, energyFormId: energyFormId };
    },
    { difference: 0, energyFormId: undefined },
  );
  return { newEnergyForm: result.energyFormId };
}

/**
 * Returns id of heating type which reduces costs the most.
 */
export function getSuggestionForSwitchToHeatPumpCost(externalCalculationData: ExternalCalculationData) {
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
      const result = heatingCoreCalculations.getTotalSummedYearlyConstantCostsDelta(
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
      const result = heatingCoreCalculations.getSummedYearlyFootprintDelta(
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
      const result = illuminationCoreCalculations.getTotalSummedYearlyConstantCostsDelta(
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
 * Returns id of bulb which reduces Co2 the most.
 */
export function getSuggestionForChangeBulbsFootprint(externalCalculationData: ExternalCalculationData) {
  const result = externalCalculationData.bulbs.reduce<{ difference: number; bulbId: string | undefined }>(
    ({ difference, bulbId }, bulb) => {
      const newBulb: ChangeBulbsActionAnswerValue = { newBulb: bulb._id };
      const possibleAnswerValue: ActionAnswerValues<ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue> =
        { value: newBulb, detailsValue: undefined };
      const possibleAction: ActionAnswerBase<ActionAnswerValues> = {
        actionId: 'changeBulbs',
        values: possibleAnswerValue,
      };
      const result = illuminationCoreCalculations.getSummedYearlyFootprintDelta(
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
