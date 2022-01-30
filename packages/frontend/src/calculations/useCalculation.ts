import { DependencyList, useMemo } from 'react';
import { ExternalCalculationData, useExternalCalculationData } from './useExternalCalculationData';

export type Calculation<T> = (externalCalculationData: ExternalCalculationData) => T;

export function useCalculation<T>(calculation: Calculation<T>, deps: DependencyList = []) {
  const { data: externalCalculationData, isLoading, error: externalCalculationError } = useExternalCalculationData();
  const result = useMemo(
    () => {
      if (isLoading || externalCalculationError) {
        return {};
      }

      try {
        return { data: calculation(externalCalculationData!) };
      } catch (error) {
        console.error('An error occured in the calculation: ', error);
        return { error };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, externalCalculationError, externalCalculationData, calculation, ...deps],
  );

  if (isLoading) {
    return { isLoading: true };
  }

  if (externalCalculationError) {
    return { isLoading, error: externalCalculationError };
  }

  return {
    isLoading,
    error: result.error,
    data: result.data,
  };
}
