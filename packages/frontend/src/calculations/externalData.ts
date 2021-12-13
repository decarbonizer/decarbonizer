import { DataFrame, IDataFrame } from 'data-forge';
import { ActionPlan } from '../api/actionPlan';
import { Bulb } from '../api/bulb';
import { RealEstate } from '../api/realEstate';
import { SurveyAnswer } from '../api/surveyAnswer';
import {
  useGetAllActionPlansQuery,
  useGetAllBulbsQuery,
  useGetAllRealEstatesQuery,
  useGetAllSurveyAnswersQuery,
} from '../store/api';

/**
 * Defines externally provided data which can be used for calculations.
 * This data (mostly) comes from the backend.
 */
export interface ExternalCalculationData {
  bulbs: IDataFrame<number, Bulb>;
  realEstates: IDataFrame<number, RealEstate>;
  surveyAnswers: IDataFrame<number, SurveyAnswer>;
  actionPlans: IDataFrame<number, ActionPlan>;
}

export function useExternalCalculationData() {
  const bulbsQuery = useGetAllBulbsQuery();
  const realEstatesQuery = useGetAllRealEstatesQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersQuery();
  const actionPlansQuery = useGetAllActionPlansQuery();
  const queries = [bulbsQuery, realEstatesQuery, surveyAnswersQuery, actionPlansQuery];

  if (queries.some((query) => query.isLoading)) {
    return { isLoading: true };
  }

  if (queries.some((query) => query.isError)) {
    return { isLoading: false, error: queries.find((query) => query.isError)!.error };
  }

  const data: ExternalCalculationData = {
    bulbs: new DataFrame(bulbsQuery.data),
    realEstates: new DataFrame(realEstatesQuery.data),
    surveyAnswers: new DataFrame(surveyAnswersQuery.data),
    actionPlans: new DataFrame(actionPlansQuery.data),
  };

  return {
    isLoading: false,
    data,
  };
}
