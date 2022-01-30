import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';
import { electricityCoreCalculations } from '../../calculations/core/electricityCoreCalculations';

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
      const result = electricityCoreCalculations.getTotalYearlyConstantCostsDelta(
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
