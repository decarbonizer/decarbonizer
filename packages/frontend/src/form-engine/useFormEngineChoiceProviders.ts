import {
  useGetAllBulbsQuery,
  useGetAllEnergyFormsQuery,
  useGetAllHeatingTypesQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../store/api';
import { KnownSurveyId } from '../data/surveys/survey';
import { SurveyAnswer } from '../api/surveyAnswer';

export function useFormEngineChoiceOptionProviders(realEstateId: string) {
  const bulbsQuery = useGetAllBulbsQuery();
  const energyFormsQuery = useGetAllEnergyFormsQuery();
  const heatingTypesQuery = useGetAllHeatingTypesQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId });

  const providers = {
    bulbs: bulbsQuery.data?.map((bulb) => ({ value: bulb._id, display: bulb.name })) ?? [],
    energyForms:
      energyFormsQuery.data?.map((energyForm) => {
        return {
          value: energyForm._id,
          display: energyForm.name,
        };
      }) ?? [],
    heatingTypes:
      heatingTypesQuery.data?.map((heatingType) => {
        return {
          value: heatingType._id,
          display: heatingType.name,
        };
      }) ?? [],
    currentRealEstateSurveyAnswers: makeSurveyAnswerProvider(surveyAnswersQuery.data ?? []),
    currentRealEstateIlluminationSurveyAnswers: makeSurveyAnswerProvider(surveyAnswersQuery.data ?? [], 'illumination'),
    currentRealEstateHeatingSurveyAnswers: makeSurveyAnswerProvider(surveyAnswersQuery.data ?? [], 'heating'),
    currentRealEstateElectricitySurveyAnswers: makeSurveyAnswerProvider(surveyAnswersQuery.data ?? [], 'electricity'),
  };

  return {
    isLoading:
      bulbsQuery.isLoading || energyFormsQuery.isLoading || heatingTypesQuery.isLoading || surveyAnswersQuery.isLoading,
    providers,
  };
}

function makeSurveyAnswerProvider(surveyAnswers: Array<SurveyAnswer>, surveyId?: KnownSurveyId) {
  return surveyAnswers
    .filter((answer) => (surveyId ? answer.surveyId === surveyId : true))
    .map((surveyAnswer) => ({
      value: surveyAnswer._id,
      display: (surveyAnswer.value as any).realEstateName,
    }));
}
