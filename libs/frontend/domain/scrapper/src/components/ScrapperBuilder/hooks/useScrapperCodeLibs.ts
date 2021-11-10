import { useVariablesContextSelector } from '@scrapper-gate/frontend/domain/variables';
import {
  variableCodeTsType,
  variablesToConstDeclaration,
} from '@scrapper-gate/shared/domain/variables';
import { useMemo } from 'react';

export const useScrapperCodeLibs = () => {
  const variables = useVariablesContextSelector((ctx) => ctx.variables);

  return useMemo(() => {
    if (!variables.length) {
      return '';
    }

    return `
      ${variableCodeTsType}

      ${variablesToConstDeclaration(variables)}
    `;
  }, [variables]);
};
