import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import { HeatLessActionAnswerValue, HeatLessActionDetailsAnswerValue } from '../../data/actions/heating/heatLessAction';
import {
  IntegrateSmartRadiatorThermostatsActionAnswerValue,
  IntegrateSmartRadiatorThermostatsActionDetailsAnswerValue,
} from '../../data/actions/heating/integrateSmartRadiatorThermostats';
import {
  SwitchToHeatPumpActionAnswerValue,
  SwitchToHeatPumpActionDetailsAnswerValue,
} from '../../data/actions/heating/switchToHeatPumpAction';
import { HeatingSurveyAnswerValue } from '../../data/surveys/heating/heatingSurveyAnswerValue';
import { getActionAnswersForAction } from '../../calculations/utils';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';

/**
 * Transforms **all given** heating survey answers so that they integrate the given action answers.
 */
export function transformHeatingSurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const heatingSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'heating');
  return heatingSurveyAnswers.map((surveyAnswer) => transformHeatingSurveyAnswer(surveyAnswer, actionAnswers));
}

/**
 * Transforms **one** heating survey answer so that it integrates the given action answers.
 */
export function transformHeatingSurveyAnswer(
  surveyAnswer: SurveyAnswer<HeatingSurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): HeatingSurveyAnswerValue {
  let result = surveyAnswer.value;

  const switchToHeatPumpActionAnswers = getActionAnswersForAction(actionAnswers, 'switchToHeatPump');
  for (const answer of switchToHeatPumpActionAnswers) {
    result = applySwitchToHeatPumpActionAnswer(surveyAnswer._id, result, answer.values);
  }

  const integrateSmartRadiatorThermostatsActionAnswers = getActionAnswersForAction(
    actionAnswers,
    'integrateSmartRadiatorThermostats',
  );
  for (const answer of integrateSmartRadiatorThermostatsActionAnswers) {
    result = applyIntegrateSmartRadiatorThermostatsActionAnswer(surveyAnswer._id, result, answer.values);
  }

  const heatLessActionAnswers = getActionAnswersForAction(actionAnswers, 'heatLess');
  for (const answer of heatLessActionAnswers) {
    result = applyHeatLessActionAnswer(surveyAnswer._id, result, answer.values);
  }

  return result;
}

function applySwitchToHeatPumpActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: HeatingSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<SwitchToHeatPumpActionAnswerValue, SwitchToHeatPumpActionDetailsAnswerValue>,
): HeatingSurveyAnswerValue {
  const {
    value: { newHeatPump },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    radiatorKind: newHeatPump,
  };
}

function applyIntegrateSmartRadiatorThermostatsActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: HeatingSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<
    IntegrateSmartRadiatorThermostatsActionAnswerValue,
    IntegrateSmartRadiatorThermostatsActionDetailsAnswerValue
  >,
): HeatingSurveyAnswerValue {
  const {
    value: { newSmartTemperature },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    smartThermostats: newSmartTemperature,
  };
}

function applyHeatLessActionAnswer(
  surveyAnswerId: string,
  surveyAnswer: HeatingSurveyAnswerValue,
  actionAnswer: ActionAnswerValues<HeatLessActionAnswerValue, HeatLessActionDetailsAnswerValue>,
): HeatingSurveyAnswerValue {
  const {
    value: { newRoomTemperature },
    detailsValue,
  } = actionAnswer;

  if (detailsValue?.surveyAnswers && !detailsValue.surveyAnswers.includes(surveyAnswerId)) {
    return surveyAnswer;
  }

  return {
    ...surveyAnswer,
    roomTemperature: newRoomTemperature,
  };
}
