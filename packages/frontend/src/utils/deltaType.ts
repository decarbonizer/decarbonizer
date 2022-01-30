export type DeltaType = 'increase' | 'decrease' | 'same';

export interface DeltaResult {
  before: number;
  after: number;
  delta: number;
  deltaType: DeltaType;
}

export function getDeltaType(delta: number): DeltaType {
  if (delta === 0) {
    return 'same';
  } else if (delta < 0) {
    return 'decrease';
  } else {
    return 'increase';
  }
}

export function mapDeltaType<TIncrease, TDecrease, TSame>(
  delta: DeltaType,
  onIncrease: TIncrease,
  onDecrease: TDecrease,
  onSame: TSame,
): TIncrease | TDecrease | TSame {
  if (delta === 'same') {
    return onSame;
  } else if (delta === 'increase') {
    return onIncrease;
  } else {
    return onDecrease;
  }
}
