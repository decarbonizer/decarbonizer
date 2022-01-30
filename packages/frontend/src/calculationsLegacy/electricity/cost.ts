import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import { DataFrame, IDataFrame } from 'data-forge';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { getDeltaType } from '../../utils/deltaType';
import { transformElectricitySurveyAnswers } from './transformation';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';

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
      const result = getElectricityCostDelta(
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

export function getElectricityCostDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const electricitySurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'electricity');
  const originalCost = getElectricityCostPerYear(
    externalCalculationData,
    electricitySurveyAnswers.map((answer) => answer.value),
  );

  const costAfterActions = getTransformedElectricityCostPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = costAfterActions - originalCost;
  const deltaType = getDeltaType(delta);

  return {
    originalCost,
    costAfterActions,
    delta,
    deltaType,
  };
}

export function getTransformedElectricityCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformElectricitySurveyAnswers(surveyAnswers, actionAnswers);
  return getElectricityCostPerYear(externalCalculationData, transformedAnswers);
}

export function getElectricityCostPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, ElectricitySurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getElectricityCostPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

function getElectricityCostPerYearForSingleSurveyAnswer(
  { energyForms }: ExternalCalculationData,
  answer: ElectricitySurveyAnswerValue,
) {
  const energyForm = energyForms.filter((energyForm) => energyForm._id === answer.energyForm).first();
  return energyForm.euroPerKwh * answer.avgConsumptionPerYear;
}
