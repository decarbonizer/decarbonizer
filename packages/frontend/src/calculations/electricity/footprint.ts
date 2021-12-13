import { ExternalCalculationData } from '../externalData';
import { IDataFrame } from 'data-forge';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { transformElectricitySurveyAnswers } from './transformation';
import { ElectricitySurveyAnswerValue } from '../../data/surveys/electricity/electricitySurveyAnswerValue';

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
