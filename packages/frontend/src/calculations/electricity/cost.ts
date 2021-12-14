import { ExternalCalculationData } from '../externalData';
import { IDataFrame } from 'data-forge';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { getDeltaType } from '../../utils/deltaType';
import { transformElectricitySurveyAnswers } from './transformation';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';

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
