import { ScrapperBuilderNodeProperties } from '@scrapper-gate/frontend/domain/scrapper';
import { VariablesProvider } from '@scrapper-gate/frontend/domain/variables';
import { FlowBuilderItem } from '@scrapper-gate/frontend/flow-builder';
import { first } from '@scrapper-gate/shared/common';
import { ScrapperAction, VariableType } from '@scrapper-gate/shared/schema';
import { renderHook } from '@testing-library/react-hooks';
import { PartialDeep } from 'type-fest';
import { v4 } from 'uuid';
import { useScrapperStepVariables } from './useScrapperStepVariables';

describe('useScrapperStepVariables', () => {
  it('should return correct variables for given step', () => {
    const items: PartialDeep<FlowBuilderItem<ScrapperBuilderNodeProperties>>[] =
      [
        {
          id: v4(),
          data: {
            key: 'test',
            action: ScrapperAction.ReadAttribute,
            isFirst: true,
            valueType: VariableType.Date,
          },
        },
        {
          id: v4(),
          data: {
            key: 'test1',
          },
        },
      ];

    items.push({
      id: v4(),
      source: items[0].id,
      target: items[1].id,
    });

    const form = () => ({
      getState: () => ({
        values: { items },
      }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hook = renderHook(() => useScrapperStepVariables(1, form as any), {
      wrapper: (props) => (
        <VariablesProvider variables={[]}>{props.children}</VariablesProvider>
      ),
    });

    expect(hook.result.current).toHaveLength(1);

    const variable = first(hook.result.current);

    expect(variable.key).toEqual('test');
    expect(variable.type).toEqual(VariableType.Date);
  });
});
