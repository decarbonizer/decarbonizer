import { DataFrame, IDataFrame } from 'data-forge';
import { ActionPlan } from '../api/actionPlan';
import { Bulb } from '../api/bulb';
import { EnergyForm } from '../api/energyForm';
import { HeatingType } from '../api/heatingType';
import { RealEstate } from '../api/realEstate';
import { SurveyAnswer } from '../api/surveyAnswer';
import {
  useGetAllActionPlansQuery,
  useGetAllBulbsQuery,
  useGetAllEnergyFormsQuery,
  useGetAllHeatingTypesQuery,
  useGetRealEstatesOfCompanyQuery,
  useGetAllSurveyAnswersQuery,
  useGetAllBaseDataQuery,
} from '../store/api';
import { useMemo } from 'react';
import { BaseData } from '../api/baseData';

/**
 * Defines externally provided data which can be used for calculations.
 * This data (mostly) comes from the backend.
 */
export interface ExternalCalculationData {
  baseData: IDataFrame<number, BaseData>;
  bulbs: IDataFrame<number, Bulb>;
  energyForms: IDataFrame<number, EnergyForm>;
  heatingTypes: IDataFrame<number, HeatingType>;
  realEstates: IDataFrame<number, RealEstate>;
  surveyAnswers: IDataFrame<number, SurveyAnswer>;
  actionPlans: IDataFrame<number, ActionPlan>;
}

export function useExternalCalculationData() {
  const baseDataQuery = useGetAllBaseDataQuery();
  const bulbsQuery = useGetAllBulbsQuery();
  const energyFormsQuery = useGetAllEnergyFormsQuery();
  const heatingTypesQuery = useGetAllHeatingTypesQuery();
  const realEstatesQuery = useGetRealEstatesOfCompanyQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersQuery();
  const actionPlansQuery = useGetAllActionPlansQuery();
  const queries = [
    bulbsQuery,
    energyFormsQuery,
    heatingTypesQuery,
    realEstatesQuery,
    surveyAnswersQuery,
    actionPlansQuery,
  ];

  return useMemo(() => {
    if (queries.some((query) => query.isLoading)) {
      return { isLoading: true };
    }

    if (queries.some((query) => query.isError)) {
      return { isLoading: false, error: queries.find((query) => query.isError)!.error };
    }

    const data: ExternalCalculationData = {
      baseData: new DataFrame(baseDataQuery.data),
      bulbs: new DataFrame(bulbsQuery.data),
      energyForms: new DataFrame(energyFormsQuery.data),
      heatingTypes: new DataFrame(heatingTypesQuery.data),
      realEstates: new DataFrame(realEstatesQuery.data),
      surveyAnswers: new DataFrame(surveyAnswersQuery.data),
      actionPlans: new DataFrame(actionPlansQuery.data),
    };

    return {
      isLoading: false,
      data,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, queries);
}
