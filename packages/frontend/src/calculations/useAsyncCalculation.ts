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

export interface UseAsyncCalculationConfig {
  skip?: boolean;
}

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
  deps?: DependencyList,
): UseAsyncCalculationResult<TFn>;

export function useAsyncCalculation<TFn extends AsyncCalculationFns>(
  fn: TFn,
  getParams: GetAsyncCalculationParams<TFn>,
  config: UseAsyncCalculationConfig,
  deps?: DependencyList,
): UseAsyncCalculationResult<TFn>;

/**
 * Asynchronously executes a well-known calculation function on a worker thread and returns a lifecycle
 * object representing the calculation's state.
 * @param fn The name of the calculation function to be invoked.
 *   This function must be registered in the [`./useAsyncCalculationWorker.ts`](./useAsyncCalculationWorker.ts) file.
 *   See the file and its comments for details.
 * @param getParams A function which, when invoked with the given external calculation data, returns
 *   an array with the parameters to be passed to the calculation function.
 * @param _configOrDeps A config object or a React dependency list which defines dependencies for triggering recalculations.
 * @param _deps A React dependency list which defines dependencies for triggering recalculations. Only used if a config is used.
 * @returns A lifecycle object representing the state of the calculation.
 */
export function useAsyncCalculation<TFn extends AsyncCalculationFns>(
  fn: TFn,
  getParams: GetAsyncCalculationParams<TFn>,
  _configOrDeps: DependencyList | UseAsyncCalculationConfig = {},
  _deps: DependencyList = [],
): UseAsyncCalculationResult<TFn> {
  const deps = isConfig(_configOrDeps) ? _deps : _configOrDeps;
  const config = isConfig(_configOrDeps) ? _configOrDeps : {};
  const skip = config.skip ?? false;

  const externalCalculationDataQuery = useExternalCalculationData();
  const [result, setResult] = useState<UseAsyncCalculationResult<TFn>>({ isLoading: true });
  const params = useAsyncCalculationParams(externalCalculationDataQuery, getParams, skip, deps);
  const arrayifiedExternalCalculationData = useArrayifiedExternalCalculationData(externalCalculationDataQuery);

  useEffect(() => {
    if (externalCalculationDataQuery.error) {
      setResult({
        isLoading: false,
        data: undefined,
        error: externalCalculationDataQuery.error,
      });
      return;
    }

    if (skip || !externalCalculationDataQuery.data || !arrayifiedExternalCalculationData || !params) {
      setResult((prev) =>
        prev.isLoading
          ? prev
          : {
              isLoading: true,
              data: prev.data,
              error: prev.error,
            },
      );
      return;
    }

    setResult((prev) =>
      prev.isLoading
        ? prev
        : {
            isLoading: true,
            data: prev.data,
            error: prev.error,
          },
    );

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

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
      console.debug('useAsyncCalculation terminated worker.');
    };
  }, [fn, params, skip, externalCalculationDataQuery, arrayifiedExternalCalculationData]);

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
  skip: boolean,
  deps: DependencyList,
) {
  return useMemo<AsyncCalculationParams<TFn> | undefined>(
    () => (externalCalculationDataQuery.data && !skip ? getParams(externalCalculationDataQuery.data) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, externalCalculationDataQuery, skip],
  );
}

function isConfig(depsOrConfig: DependencyList | UseAsyncCalculationConfig): depsOrConfig is UseAsyncCalculationConfig {
  return !Array.isArray(depsOrConfig);
}
