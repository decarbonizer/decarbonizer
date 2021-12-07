import { FormEngineChoiceOptionProviders } from './types';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../store/api';

export function useFormEngineChoiceOptionProviders(realEstateId: string) {
  const bulbsQuery = useGetAllBulbsQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId });
  const providers: FormEngineChoiceOptionProviders = {
    bulbs: bulbsQuery.data?.map((bulb) => ({ value: bulb._id, display: bulb.name })) ?? [],
    currentRealEstateSurveyAnswers:
      surveyAnswersQuery.data?.map((surveyAnswer) => ({
        value: surveyAnswer._id,
        display: (surveyAnswer.value as any).realEstateName,
      })) ?? [],
  };

  return {
    isLoading: bulbsQuery.isLoading || surveyAnswersQuery.isLoading,
    providers,
  };
}
