import {
  useGetAllBulbsQuery,
  useGetAllEnergyFormsQuery,
  useGetAllHeatingTypesQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../store/api';
import { KnownSurveyId } from '../data/surveys/survey';
import { SurveyAnswer } from '../api/surveyAnswer';
import { DataFrame } from 'data-forge';

export function useFormEngineChoiceOptionProviders(realEstateId: string) {
  const bulbsQuery = useGetAllBulbsQuery();
  const energyFormsQuery = useGetAllEnergyFormsQuery();
  const heatingTypesQuery = useGetAllHeatingTypesQuery();
  const surveyAnswersQuery = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId });

  const providers = {
    bulbs: new DataFrame(bulbsQuery.data ?? [])
      .map((bulb) => ({ value: bulb._id, display: bulb.name }))
      .orderBy((option) => option.display)
      .toArray(),
    energyForms: new DataFrame(energyFormsQuery.data ?? [])
      .orderBy((energyForm) => energyForm.co2PerGramPerKwh)
      .map((energyForm) => {
        return {
          value: energyForm._id,
          display: energyForm.name,
        };
      })
      .toArray(),
    heatingTypes: new DataFrame(heatingTypesQuery.data ?? [])
      .orderBy((heatingType) => heatingType.consumptionKwh)
      .map((heatingType) => {
        return {
          value: heatingType._id,
          display: heatingType.name,
        };
      })
      .toArray(),
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
  return new DataFrame(surveyAnswers)
    .filter((answer) => (surveyId ? answer.surveyId === surveyId : true))
    .map((surveyAnswer) => ({
      value: surveyAnswer._id,
      display: (surveyAnswer.value as any).realEstateName,
    }))
    .orderBy((option) => option.display)
    .toArray();
}
