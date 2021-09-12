import { first } from '@scrapper-gate/shared/common';
import { travelNodeLike } from './travelNodeLike';
import { NodeLikeItem } from './types';

describe('Travel node like', () => {
  it('should travel incomers', () => {
    const nodes: NodeLikeItem[] = [
      {
        id: '1',
        nextStep: {
          id: '2',
        },
      },
      {
        id: '2',
        nextStep: {
          id: '3',
        },
      },
      {
        id: '3',
      },
    ];

    const callback = jest.fn();

    travelNodeLike({
      start: nodes[1],
      items: nodes,
      direction: 'in',
      callback,
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(first(nodes));
  });

  it('should travel outgoers', () => {
    const nodes: NodeLikeItem[] = [
      {
        id: '1',
        nextStep: {
          id: '2',
        },
      },
      {
        id: '2',
        nextStep: {
          id: '3',
        },
      },
      {
        id: '3',
      },
    ];

    const callback = jest.fn();

    travelNodeLike({
      start: nodes[0],
      items: nodes,
      direction: 'out',
      callback,
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(nodes[1]);
    expect(callback).toHaveBeenCalledWith(nodes[2]);
  });
});
