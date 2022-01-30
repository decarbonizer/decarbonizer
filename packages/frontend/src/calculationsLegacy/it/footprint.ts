import { ExternalCalculationData } from '../../calculations/useExternalCalculationData';
import { IDataFrame } from 'data-forge';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { transformItSurveyAnswers } from './transformation';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import { getDeltaType } from '../../utils/deltaType';

export function getItFootprintDelta(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const itSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'it');
  const originalFootprint = getItFootprintPerYear(
    externalCalculationData,
    itSurveyAnswers.map((answer) => answer.value),
  );

  const footprintAfterActions = getTransformedItFootprintPerYear(
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

export function getTransformedItFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformItSurveyAnswers(surveyAnswers, actionAnswers);
  return getItFootprintPerYear(externalCalculationData, transformedAnswers);
}

export function getItFootprintPerYear(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, ItSurveyAnswerValue>,
) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers
    .map((answer) => getItFootprintPerYearForSingleSurveyAnswer(externalCalculationData, answer))
    .aggregate((a, b) => a + b);
}

function getItFootprintPerYearForSingleSurveyAnswer(
  { energyForms }: ExternalCalculationData,
  answer: ItSurveyAnswerValue,
) {
  const footprintPerServer = 320; // 320 kg/year for servers that are on premise or in data center

  const energyForm = energyForms.filter((energyForm) => energyForm._id === answer.dataCenterEnergyForm).first();
  let energyFootprint = (energyForm.co2PerGramPerKwh / 1000) * answer.dataCenterConsumption;
  if (answer.superServer) {
    energyFootprint = energyFootprint * 0.3; // energy consumption is approximately 70% lower
  }
  return footprintPerServer * answer.gpuServerCount + energyFootprint;
}
/**
 * Calculates produced heating while using super servers
 */
export function getTransformedProducedHeatingPerYear(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const transformedAnswers = transformItSurveyAnswers(surveyAnswers, actionAnswers);
  return getProducedHeatingPerYear(transformedAnswers);
}

export function getProducedHeatingPerYear(surveyAnswers: IDataFrame<number, ItSurveyAnswerValue>) {
  if (surveyAnswers.count() === 0) {
    return 0;
  }
  return surveyAnswers.map((answer) => getProducedHeatingForSingleSurveyAnswer(answer)).reduce((a, b) => a + b);
}

function getProducedHeatingForSingleSurveyAnswer(answer: ItSurveyAnswerValue) {
  return answer.superServer ? answer.dataCenterConsumption * 0.7 : 0; // super server produces approximately 70% heating
}
