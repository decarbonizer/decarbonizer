import { ExternalCalculationData } from '../externalData';
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
  const energyForm = energyForms.filter((energyForm) => energyForm._id === answer.dataCenterEnergyForm).first();
  return energyForm.co2PerGramPerKwh * answer.dataCenterConsumption;
}
