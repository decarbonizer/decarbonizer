import { FormEngineChoiceOptionProviders } from '../../form-engine/types';
import { useGetAllBulbsQuery } from '../../store/api';

export function useSurveyChoiceOptionProviders() {
  const bulbsQuery = useGetAllBulbsQuery();
  const providers: FormEngineChoiceOptionProviders = {
    bulbs: bulbsQuery.data?.map((bulb) => ({ value: bulb._id, display: bulb.name })) ?? [],
  };

  return {
    isLoading: bulbsQuery.isLoading,
    providers,
  };
}
