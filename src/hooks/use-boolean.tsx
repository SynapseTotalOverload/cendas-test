import { useState, useCallback } from "react";

type BoolState = Record<string, boolean>;

export function useBoolean(initialState: BoolState = {}) {
  const [state, setState] = useState<BoolState>(initialState);

  const isBool = useCallback(
    (key: string): boolean => {
      return !!state[key];
    },
    [state],
  );

  const changeBool = useCallback((key: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const toggleBool = useCallback((key: string) => {
    setState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return {
    isBool,
    changeBool,
    toggleBool,
    state,
  };
}
