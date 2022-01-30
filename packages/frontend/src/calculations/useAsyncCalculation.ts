import { DependencyList, useEffect, useMemo, useState } from 'react';
import { ExternalCalculationData, useExternalCalculationData } from './useExternalCalculationData';
import type {
  ArrayifiedExternalCalculationData,
  AsyncCalculationFns,
  AsyncCalculationParams,
  AsyncCalculationResult,
  AsyncCalculationMessage,
  AsyncCalculationResultMessage,
} from './useAsyncCalculationWorker';

export interface UseAsyncCalculationResult<TFn extends AsyncCalculationFns> {
  isLoading: boolean;
  data?: AsyncCalculationResult<TFn>;
  error?: any;
}

export type GetAsyncCalculationParams<TFn extends AsyncCalculationFns> = (
  externalCalculationData: ExternalCalculationData,
) => AsyncCalculationParams<TFn>;

/**
 * Asynchronously executes a well-known calculation function on a worker thread and returns a lifecycle
 * object representing the calculation's state.
 * @param fn The name of the calculation function to be invoked.
 *   This function must be registered in the [`./useAsyncCalculationWorker.ts`](./useAsyncCalculationWorker.ts) file.
 *   See the file and its comments for details.
 * @param getParams A function which, when invoked with the given external calculation data, returns
 *   an array with the parameters to be passed to the calculation function.
 * @param deps A React dependency list which defines dependencies for triggering recalculations.
 * @returns A lifecycle object representing the state of the calculation.
 */
export function useAsyncCalculation<TFn extends AsyncCalculationFns>(
  fn: TFn,
  getParams: GetAsyncCalculationParams<TFn>,
  deps: DependencyList = [],
): UseAsyncCalculationResult<TFn> {
  const externalCalculationDataQuery = useExternalCalculationData();
  const [result, setResult] = useState<UseAsyncCalculationResult<TFn>>({ isLoading: true });
  const params = useAsyncCalculationParams(externalCalculationDataQuery, getParams, deps);
  const arrayifiedExternalCalculationData = useArrayifiedExternalCalculationData(externalCalculationDataQuery);

  useEffect(() => {
    if (!arrayifiedExternalCalculationData || !params) {
      return;
    }

    const worker = new Worker(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Reason: import.meta.url is correctly handled by Parcel.
      new URL('./useAsyncCalculationWorker.ts', import.meta.url),
      { type: 'module' },
    );
    const message: AsyncCalculationMessage<TFn> = {
      fn,
      params,
      arrayifiedExternalCalculationData,
    };

    const handleMessage = (e: MessageEvent<AsyncCalculationResultMessage<TFn>>) => {
      console.debug('useAsyncCalculation received result message: ', e.data);
      setResult((prev) => ({
        isLoading: false,
        data: e.data.result ?? prev.data,
        error: e.data.error,
      }));
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage(message);
    console.debug('useAsyncCalculation started worker with message: ', message);

    setResult((prev) =>
      prev.isLoading
        ? prev
        : {
            isLoading: true,
            data: prev.data,
            error: prev.error,
          },
    );

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
      console.debug('useAsyncCalculation terminated worker.');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, params, arrayifiedExternalCalculationData]);

  if (externalCalculationDataQuery.error) {
    return {
      isLoading: false,
      data: undefined,
      error: externalCalculationDataQuery.error,
    };
  }

  if (!externalCalculationDataQuery.data) {
    return {
      isLoading: true,
      data: undefined,
      error: undefined,
    };
  }

  return result;
}

function useArrayifiedExternalCalculationData(
  externalCalculationDataQuery: ReturnType<typeof useExternalCalculationData>,
) {
  return useMemo<ArrayifiedExternalCalculationData | undefined>(() => {
    if (!externalCalculationDataQuery.data) {
      return undefined;
    }

    // ExternalCalculationData encapsulates DataFrame instances. These must be converted to arrays
    // prior to being transfered to the worker.
    const externalCalculationData: ArrayifiedExternalCalculationData = {} as any;
    for (const [key, value] of Object.entries(externalCalculationDataQuery.data)) {
      externalCalculationData[key] = value.toArray();
    }

    return externalCalculationData;
  }, [externalCalculationDataQuery]);
}

function useAsyncCalculationParams<TFn extends AsyncCalculationFns>(
  externalCalculationDataQuery: ReturnType<typeof useExternalCalculationData>,
  getParams: GetAsyncCalculationParams<TFn>,
  deps: DependencyList,
) {
  return useMemo<AsyncCalculationParams<TFn> | undefined>(
    () => (externalCalculationDataQuery.data ? getParams(externalCalculationDataQuery.data) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, externalCalculationDataQuery],
  );
}
