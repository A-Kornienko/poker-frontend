export const createMemoSelector = <S, R>(selector: (state: S) => R) => {
  let lastState: S | null = null;
  let lastResult: R | null = null;

  return (state: S) => {
    if (state === lastState) return lastResult as R;

    const next = selector(state);
    if (lastResult !== null && deepEqual(next, lastResult)) {
      lastState = state;
      return lastResult;
    }

    lastState = state;
    lastResult = next;
    return next;
  };
};

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false;
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const key in a) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
};
