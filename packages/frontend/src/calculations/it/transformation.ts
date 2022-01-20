import { SurveyAnswer } from '../../api/surveyAnswer';
import { ItSurveyAnswerValue } from '../../data/surveys/it/itSurveyAnswerValue';
import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { getActionAnswerForAction } from '../actionAnswers/getActionAnswerForAction';
import { ActionAnswerValues } from '../../data/actions/action';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';
import {
  IncreaseDataCenterTemperatureActionAnswerValue,
  IncreaseDataCenterTemperatureActionDetailsAnswerValue,
} from '../../data/actions/it/increaseDataCenterTemperature';
import {
  UseSuperServerActionAnswerValue,
  UseSuperServerActionDetailsAnswerValue,
} from '../../data/actions/it/useSuperServer';

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

  const increaseDataCenterTemperatureActionAnswer = getActionAnswerForAction(
    actionAnswers,
    'increaseDataCenterTemperature',
  );

  const useSuperServerActionAnswer = getActionAnswerForAction(actionAnswers, 'useSuperServer');

  if (increaseDataCenterTemperatureActionAnswer) {
    result = applyIncreaseDataCenterTemperatureActionAnswer(
      surveyAnswer._id,
      result,
      increaseDataCenterTemperatureActionAnswer.values,
    );
  }

  if (useSuperServerActionAnswer) {
    result = applyUseSuperServerActionAnswer(surveyAnswer._id, result, useSuperServerActionAnswer.values);
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

function applyUseSuperServerActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: ItSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<UseSuperServerActionAnswerValue, UseSuperServerActionDetailsAnswerValue>,
): ItSurveyAnswerValue {
  const {
    value: { newServer },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  const answer = {
    ...surveyAnswer,
    dataCenterEnergyForm: '00000000-0000-0000-0000-000000000001', //Water energy form
    superServer: newServer,
  };
  return answer;
}
