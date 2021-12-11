import { IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ActionAnswerValues } from '../../data/actions/action';
import {
  ChangeBulbsActionAnswerValue,
  ChangeBulbsActionDetailsAnswerValue,
} from '../../data/actions/illumination/changeBulbsAction';
import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { getActionAnswerForAction } from '../actionAnswers/getActionAnswerForAction';
import { getSurveyAnswersForSurvey } from '../surveyAnswers/getSurveyAnswersForSurvey';

export function getTransformedIlluminationSurveyAnswers(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
) {
  const illuminationSurveyAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'illumination');
  return illuminationSurveyAnswers.map((surveyAnswer) =>
    transformIlluminationSurveyAnswer(surveyAnswer, actionAnswers),
  );
}

function transformIlluminationSurveyAnswer(
  surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
): IlluminationSurveyAnswerValue {
  const changeBulbsAction = getActionAnswerForAction(actionAnswers, 'changeBulbs');
  return changeBulbsAction ? applyChangeBulbsActionAnswer(surveyAnswer, changeBulbsAction.values) : surveyAnswer.value;
}

function applyChangeBulbsActionAnswer(
  surveyAnswer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  actionAnswer: ActionAnswerValues<ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue>,
): IlluminationSurveyAnswerValue {
  if (actionAnswer.detailsValue?.surveyAnswers && !actionAnswer.detailsValue.surveyAnswers.includes(surveyAnswer._id)) {
    return surveyAnswer.value;
  }

  return {
    ...surveyAnswer.value,
    bulbType: actionAnswer.value.newBulb,
  };
}
