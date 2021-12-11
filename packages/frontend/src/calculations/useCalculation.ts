import { ExternalCalculationData, useExternalCalculationData } from './externalData';

export type Calculation<T> = (externalCalculationData: ExternalCalculationData) => T;

export function useCalculation<T>(calculation: Calculation<T>) {
  const { data, isLoading, error } = useExternalCalculationData();

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading, error };
  }

  return {
    isLoading,
    error,
    data: calculation(data!),
  };
}
