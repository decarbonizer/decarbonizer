import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import {
  ChangeBulbsActionAnswerValue,
  ChangeBulbsActionDetailsAnswerValue,
} from '../../data/actions/illumination/changeBulbsAction';
import { ActionAnswerValues } from '../../data/actions/action';
import { illuminationCoreCalculations } from '../../calculations/core/illuminationCoreCalculations';

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
