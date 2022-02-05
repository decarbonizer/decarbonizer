import { DataFrame, IDataFrame } from 'data-forge';
import { ExternalCalculationData } from './useExternalCalculationData';
import { getBudgetChartData } from './calculations/getBudgetChartData';
import { getCostDeltaCardData } from './calculations/getCostDeltaCardData';
import { getFootprintDeltaCardData } from './calculations/getFootprintDeltaCardData';
import { getFootprintComparisonCardData } from './calculations/getFootprintComparisonCardData';
import { getCostComparisonCardData } from './calculations/getCostComparisonChartData';
import { getCalculatedCostsCardData } from './calculations/getCalculatedCostsCardData';
import { getCostBreakEvenPointData } from './calculations/getCostBreakEvenPointData';
import { getSurveyAnswersTransformedByActionPlans } from './calculations/getSurveyAnswersTransformedByActionPlans';
import { getNetZero } from './calculations/getNetZero';
import { getGlobalRealEstateFootprintCardData } from './calculations/getGlobalRealEstateFootprintCardData';
import { getRealEstateFootprintComparisonCardData } from './calculations/getRealEstateFootprintComparisonCardData';
import { getGlobalCompanyFootprintCardData } from './calculations/getGlobalCompanyFootprintCardData';
import { getActionPlanCardData } from './calculations/getActionPlanCardData';

// The core of the worker is simple:
// We maintain a dictionary `asyncCalculations` which maps the calculation functions to their own function name.
// This allows us to easily retrieve and invoke functions by name only (the name and the params are passed via messages).
//
// All async calculation functions are required to accept an `ExternalCalculationParameter` as the first argument and
// they are expected to run synchronously. Naturally, all parameters must be clonable.
// Otherwise there are no further constraints.
//
// The above conditions allow us to create types which extract all invokable functions and their required arguments.
// This gives us full typing completely inferred from the dictionary.
type AsyncCalculation = (externalCalculationData: ExternalCalculationData, ...rest: Array<any>) => any;
const createAsyncCalculationsDict = <T extends { [K in keyof T]: AsyncCalculation }>(dict: T) => dict;

const asyncCalculations = createAsyncCalculationsDict({
  // Register new calculation functions to be runnable via `useAsyncCalculation` below.
  getSurveyAnswersTransformedByActionPlans,
  getBudgetChartData,
  getCostDeltaCardData,
  getCostComparisonCardData,
  getFootprintDeltaCardData,
  getFootprintComparisonCardData,
  getCalculatedCostsCardData,
  getCostBreakEvenPointData,
  getNetZero,
  getGlobalRealEstateFootprintCardData,
  getGlobalCompanyFootprintCardData,
  getRealEstateFootprintComparisonCardData,
  getActionPlanCardData,
});

type Tail<T extends any[]> = T extends [any, ...infer Tail] ? Tail : any[];
export type AsyncCalculationFns = keyof typeof asyncCalculations;
export type AsyncCalculationParams<T extends AsyncCalculationFns> = Tail<Parameters<typeof asyncCalculations[T]>>;
export type AsyncCalculationResult<T extends AsyncCalculationFns> = ReturnType<typeof asyncCalculations[T]>;

export type ArrayifiedExternalCalculationData = {
  [K in keyof ExternalCalculationData]: Array<ExternalCalculationData[K] extends IDataFrame<any, infer T> ? T : never>;
};

// Communication with the worker happens via the following messages.
// The first message must be sent to kickoff the worker.
// The second message is sent by the worker when the calculation finishes or when it errors.
export interface AsyncCalculationMessage<TFn extends AsyncCalculationFns = AsyncCalculationFns> {
  fn: TFn;
  params: AsyncCalculationParams<TFn>;
  arrayifiedExternalCalculationData: ArrayifiedExternalCalculationData;
}

export interface AsyncCalculationResultMessage<TFn extends AsyncCalculationFns = AsyncCalculationFns> {
  result?: AsyncCalculationResult<TFn>;
  error?: any;
}

onmessage = (e: MessageEvent<Partial<AsyncCalculationMessage> | undefined>) => {
  const message = e.data;
  console.debug('Received message: ', e.data);

  // We could rely on the message being in the right format, but some sanity checks don't hurt while
  // also helping when debugging.
  if (
    typeof message?.fn !== 'string' ||
    !Array.isArray(message?.params) ||
    typeof message.arrayifiedExternalCalculationData !== 'object'
  ) {
    console.error('Received unexpected AsyncCalculationMessage: ', message);
    return;
  }

  const fn = asyncCalculations[message.fn];
  if (!fn) {
    console.error(`No calculation with key ${message.fn} exists.`);
  }

  // ExternalCalculationData was sent as an object encapsulating arrays. These must be converted
  // back to DataFrame instances to match the ExternalCalculationData type expected by the
  // calculation fns.
  const externalCalculationData: ExternalCalculationData = {} as any;
  for (const [key, value] of Object.entries(message.arrayifiedExternalCalculationData)) {
    externalCalculationData[key] = new DataFrame(value as any);
  }

  try {
    const result = (fn as any)(externalCalculationData, ...message.params);
    const resultMessage: AsyncCalculationResultMessage = { result };
    postMessage(resultMessage);
  } catch (e) {
    console.error('Error in the async calculation: ', e);
    const resultMessage: AsyncCalculationResultMessage = { error: `${e}` };
    postMessage(resultMessage);
  }
};
