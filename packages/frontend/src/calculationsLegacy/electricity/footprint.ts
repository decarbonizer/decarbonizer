import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import { DataFrame, IDataFrame } from 'data-forge';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { transformElectricitySurveyAnswers } from './transformation';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { getDeltaType } from '../../utils/deltaType';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  SwitchToGreenEnergyActionAnswerValue,
  SwitchToGreenEnergyDetailsAnswerValue,
} from '../../data/actions/electricity/switchToGreenEnergy';

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
      const result = getElectricityFootprintDelta(
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

export function getElectricityFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const illuminationSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'electricity');
  const originalFootprint = getElectricityFootprintPerYear(
    externalCalculationData,
    illuminationSurveyAnswers.map((answer) => answer.value),
  );

  const footprintAfterActions = getTransformedElectricityFootprintPerYear(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    actionAnswers,
  );

  const delta = footprintAfterActions - originalFootprint;
  const deltaType = getDeltaType(delta);

  return {
    originalFootprint,
    footprintAfterActions,
    delta,
    deltaType,
  };
}

export function getTransformedElectricityFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformElectricitySurveyAnswers(surveyAnswers, actionAnswers);
  return getElectricityFootprintPerYear(externalCalculationData, transformedAnswers);
}

export function getElectricityFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, ElectricitySurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getElectricityFootprintPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

function getElectricityFootprintPerYearForSingleSurveyAnswer(
  { energyForms }: ExternalCalculationData,
  answer: ElectricitySurveyAnswerValue,
) {
  const energyForm = energyForms.filter((energyForm) => energyForm._id === answer.energyForm).first();
  return energyForm.co2PerGramPerKwh * answer.avgConsumptionPerYear;
}
