import { FormEngineChoiceOptionProviders } from './types';
import { useGetAllBulbsQuery } from '../store/api';

export function useFormEngineChoiceOptionProviders() {
  const bulbsQuery = useGetAllBulbsQuery();
  const providers: FormEngineChoiceOptionProviders = {
    bulbs: bulbsQuery.data?.map((bulb) => ({ value: bulb._id, display: bulb.name })) ?? [],
  };

  return {
    isLoading: bulbsQuery.isLoading,
    providers,
  };
}
