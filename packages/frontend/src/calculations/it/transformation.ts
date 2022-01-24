import { SurveyAnswer } from '../../api/surveyAnswer';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { getActionAnswersForAction } from '../actionAnswers/getActionAnswerForAction';
import { ActionAnswerValues } from '../../data/actions/action';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import {
  IncreaseDataCenterTemperatureActionAnswerValue,
  IncreaseDataCenterTemperatureActionDetailsAnswerValue,
} from '../../data/actions/it/increaseDataCenterTemperature';

export function transformItSurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const itSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'it');
  return itSurveyAnswers.map((surveyAnswer) => transformItSurveyAnswer(surveyAnswer, actionAnswers));
}

export function transformItSurveyAnswer(
  surveyAnswer: SurveyAnswer<ItSurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): ItSurveyAnswerValue {
  let result = surveyAnswer.value;

  const increaseDataCenterTemperatureActionAnswers = getActionAnswersForAction(
    actionAnswers,
    'increaseDataCenterTemperature',
  );
  for (const answer of increaseDataCenterTemperatureActionAnswers) {
    result = applyIncreaseDataCenterTemperatureActionAnswer(surveyAnswer._id, result, answer.values);
  }

  return result;
}

function applyIncreaseDataCenterTemperatureActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: ItSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<
    IncreaseDataCenterTemperatureActionAnswerValue,
    IncreaseDataCenterTemperatureActionDetailsAnswerValue
  >,
): ItSurveyAnswerValue {
  const {
    value: { newDataCenterTemperature },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  const temperatureIncreased = newDataCenterTemperature - surveyAnswer.dataCenterTemperature;
  const newDataCenterConsumption = surveyAnswer.dataCenterConsumption * Math.pow(0.92, temperatureIncreased);

  return {
    ...surveyAnswer,
    dataCenterTemperature: newDataCenterTemperature,
    dataCenterConsumption: newDataCenterConsumption,
  };
}
