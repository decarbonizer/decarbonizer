import { useMemo } from 'react';
import { Action } from './action';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { FormSchema } from '../../form-engine/formSchema';

export function useActionSchema(action: Action | undefined, surveyAnswers?: SurveyAnswer[] | undefined): FormSchema {
  const schema = useMemo(() => {
    const latestSurvey = surveyAnswers
      ?.slice()
      .reverse()
      .find((survey) => {
        return survey.surveyId === action?.forSurvey;
      });
    return action?.getSchema(latestSurvey);
  }, [action, surveyAnswers]);

  return schema ?? { pages: [] };
}
