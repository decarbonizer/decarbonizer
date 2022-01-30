import { IDataFrame } from 'data-forge';
import { isSurveyAnswerType, SurveyAnswer } from '../../api/surveyAnswer';
import { KnownSurveyId, SurveyToSurveyAnswerMap } from '../../data/surveys/survey';

/**
 * Returns a data frame which contains only the survey answers for the given {@link surveyId}.
 * @param surveyId The ID of the surveys whose survey answers should be filtered.
 */
export function getSurveyAnswersForSurvey<TSurveyId extends KnownSurveyId>(
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  surveyId: TSurveyId,
): IDataFrame<number, SurveyAnswer<SurveyToSurveyAnswerMap[TSurveyId]>> {
  return surveyAnswers.filter((surveyAnswer) => isSurveyAnswerType(surveyId, surveyAnswer)) as any;
}
