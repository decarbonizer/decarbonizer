import { FormEngineChoiceOptionProviders } from './types';
import { useGetAllBulbsQuery, useGetAllEnergyFormsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../store/api';

export function useFormEngineChoiceOptionProviders(realEstateId: string) {
  const bulbsQuery = useGetAllBulbsQuery();
  const energyFormsQuery = useGetAllEnergyFormsQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId });
  const providers: FormEngineChoiceOptionProviders = {
    bulbs: bulbsQuery.data?.map((bulb) => ({ value: bulb._id, display: bulb.name })) ?? [],
    energyForms:
      energyFormsQuery.data?.map((energyForm) => {
        return {
          value: energyForm._id,
          display: energyForm.name,
        };
      }) ?? [],
    currentRealEstateSurveyAnswers:
      surveyAnswersQuery.data?.map((surveyAnswer) => ({
        value: surveyAnswer._id,
        display: (surveyAnswer.value as any).realEstateName,
      })) ?? [],
  };

  return {
    isLoading: bulbsQuery.isLoading || energyFormsQuery.isLoading || surveyAnswersQuery.isLoading,
    providers,
  };
}
