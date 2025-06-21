// zustand-utils.ts
import type { Observable } from "rxjs";
import { fromEventPattern } from "rxjs";

export type GetState<T> = () => T;

export type StateSelector<T, U> = (state: T) => U;

export type EqualityChecker<T> = (a: T, b: T) => boolean;

type InferState<
  TStore extends {
    getState: GetState<object>;
  },
> = TStore extends {
  getState: GetState<infer TState>;
}
  ? TState
  : never;

export const toStream = <
  TStore extends {
    getState: GetState<object>;
  },
  TStateSlice,
  TState extends object = InferState<TStore>,
>(
  store: TStore,
  selector: StateSelector<TState, TStateSlice>,
  options?: {
    equalityFn?: EqualityChecker<TStateSlice>;
    fireImmediately?: boolean;
  },
): Observable<TStateSlice> => {
  const result = fromEventPattern<TStateSlice>(
    handler =>
      (store as any).subscribe(
        selector,
        (value: TStateSlice) => {
          handler(value);
        },
        options,
      ),
    (_handler, signal) => signal(),
  );

  return result;
};
