import {
  ScrapperBuilderFormState,
  ScrapperBuilderNodeProperties,
} from '@scrapper-gate/frontend/domain/scrapper';
import { useVariablesContext } from '@scrapper-gate/frontend/domain/variables';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import {
  getPotentialVariablesForStep,
  GetPotentialVariablesStep,
} from '@scrapper-gate/shared/domain/scrapper';
import { Maybe } from '@scrapper-gate/shared/schema';
import get from 'lodash.get';
import { useMemo } from 'react';
import { useForm } from 'react-final-form';

export const useScrapperStepVariables = (getFieldName: FieldNameCreator) => {
  const { variables } = useVariablesContext();

  const { getState } = useForm();

  return useMemo(() => {
    const values = getState().values as ScrapperBuilderFormState;

    const step = get(
      values,
      getFieldName()
    ) as Maybe<ScrapperBuilderNodeProperties>;

    if (!step) {
      return variables;
    }

    const allSteps = values.items.map((node) => node.data).filter(ExcludeFalsy);

    return [
      ...variables,
      ...getPotentialVariablesForStep(
        step as GetPotentialVariablesStep,
        allSteps as GetPotentialVariablesStep[]
      ),
    ];
  }, [getFieldName, getState, variables]);
};
