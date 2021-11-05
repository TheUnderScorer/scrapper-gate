import { isError } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useCallback, useState } from 'react';
import { map, pipe } from 'remeda';

type Vars = Record<string, unknown>;

export interface UseCodeRunnerParams {
  code: string;
  // Additional "const" variables that will be injected before code
  additionalConstants?: Vars;
  throwOnError?: boolean;
}

export interface RunCodeResult {
  result?: unknown;
  error?: Error;
}

const injectVars = (constants?: Vars) => {
  if (!constants) {
    return '';
  }

  return pipe(
    Object.entries(constants),
    map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`),
    (array) => array.join('\n')
  );
};

export const useCodeRunner = ({
  code,
  additionalConstants,
  throwOnError,
}: UseCodeRunnerParams) => {
  const [lastResult, setLastResult] = useState<unknown>();
  const [lastError, setLastError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setLastError(undefined);
    setLastResult(undefined);

    try {
      const fullCode = `
        ${injectVars(additionalConstants)}
        ${code}
      `;

      logger.debug('Running code', { code: fullCode });

      // eslint-disable-next-line no-new-func
      const result = await Function(fullCode)();

      setLastResult(result);

      return result;
    } catch (error) {
      if (isError(error)) {
        setLastError(error);
      }

      if (throwOnError) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, [additionalConstants, code, throwOnError]);

  return {
    loading,
    lastResult,
    lastError,
    run,
  };
};
