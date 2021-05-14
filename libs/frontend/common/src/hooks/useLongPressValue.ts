import { useCallback, useEffect, useState } from 'react';

interface LongPressHookProps<Value = unknown> {
  onLongPress: (prevValue?: Value) => Value | Promise<Value>;
  onFinish?: (value?: Value) => unknown;
  interval?: number;
  requiredPressMs?: number;
  currentValue?: Value;
}

export const useLongPressValue = <Value>({
  onLongPress,
  onFinish,
  interval = 100,
  currentValue,
  requiredPressMs = 750,
}: LongPressHookProps<Value>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [id, setId] = useState<any | null>(null);
  const [value, setValue] = useState<undefined | Value>(currentValue);

  const handleMouseDown = useCallback(async () => {
    const handler = async (prevValue?: Value) => {
      const newValue = await onLongPress(prevValue);

      setValue(newValue);

      setId(setTimeout(async () => handler(newValue), interval));
    };

    setId(setTimeout(async () => handler(value), requiredPressMs));
  }, [onLongPress, interval, requiredPressMs, value]);

  const handleMouseUp = useCallback(() => {
    clearInterval(id);
    setId(null);

    if (onFinish) {
      onFinish(value);
    }
  }, [id, value, onFinish]);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  return {
    handleMouseDown,
    handleMouseUp,
    value,
  };
};
