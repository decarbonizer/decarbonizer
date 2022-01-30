import { DependencyList, useMemo } from 'react';
import { ExternalCalculationData, useExternalCalculationData } from './useExternalCalculationData';
import { useAsyncCalculation } from './useAsyncCalculation';

export type Calculation<T> = (externalCalculationData: ExternalCalculationData) => T;

/**
 * Synchronously executes the given calculation, providing external calculation data to it.
 * @param calculation The calculation to be made.
 * @param deps A React dependency list which defines dependencies for triggering recalculations.
 * @returns A lifecycle object representing the state of the calculation.
 * @deprecated If possible, use the new {@link useAsyncCalculation} as it is much more performant.
 *   This will require an update to the calculation function though.
 */
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
