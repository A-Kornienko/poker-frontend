import { deepEqual } from "../../utils/deepEqual";

export const createMemoSelector = <S, R>(
  selector: (state: S) => R,
) => {
  let lastState: S | null = null;
  let lastResult: R | null = null;

  return (state: S): R => {
    if (state === lastState) {
      return lastResult as R;
    }

    const nextResult = selector(state);

    if (lastResult !== null && deepEqual(nextResult, lastResult)) {
      lastState = state;
      return lastResult;
    }

    lastState = state;
    lastResult = nextResult;

    return nextResult;
  };
};