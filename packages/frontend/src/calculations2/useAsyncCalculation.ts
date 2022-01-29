import { DependencyList, useEffect, useMemo, useState } from 'react';
import { ExternalCalculationData, useExternalCalculationData } from '../calculations/externalData';
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

export function useAsyncCalculation<TFn extends AsyncCalculationFns>(
  fn: TFn,
  getParams: GetAsyncCalculationParams<TFn>,
  deps: DependencyList = [],
): UseAsyncCalculationResult<TFn> {
  const externalCalculationDataQuery = useExternalCalculationData();
  const [result, setResult] = useState<UseAsyncCalculationResult<TFn>>({ isLoading: true });
  const params = useAsyncCalculationParams(externalCalculationDataQuery, getParams);
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
  }, [...deps, fn, params, arrayifiedExternalCalculationData]);

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
) {
  return useMemo<AsyncCalculationParams<TFn> | undefined>(
    () => (externalCalculationDataQuery.data ? getParams(externalCalculationDataQuery.data) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [externalCalculationDataQuery],
  );
}
