import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToHeatPumpActionAnswerValue,
  SwitchToHeatPumpActionDetailsAnswerValue,
} from '../../data/actions/heating/switchToHeatPumpAction';
import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import { heatingCoreCalculations } from '../../calculations/core/heatingCoreCalculations';

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
      const result = heatingCoreCalculations.getTotalYearlyConstantCostsDelta(
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
