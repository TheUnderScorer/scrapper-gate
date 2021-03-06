/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { List, ListItemText } from '@material-ui/core';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { BaseEntity, Pagination } from '@scrapper-gate/shared/schema';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import gql from 'graphql-tag';
import React from 'react';
import { range } from 'remeda';
import { ControlledList, ControlledListProps } from './ControlledList';

interface TestItem extends BaseEntity {
  __typename?: 'TestItem';
}

gql`
  type TestItem implements BaseEntity {
    id: ID!
    updatedAt: Date!
    createdAt: Date!
    deletedAt: Date
  }

  type TestItemQueryResult {
    items: [TestItem!]
    total: Int!
  }

  extend type Query {
    getTestItems(
      order: Order
      pagination: Pagination
      id: [ID!]
    ): TestItemQueryResult
  }
`;

const query = gql`
  query TestQuery($order: Order, $pagination: Pagination, $id: [ID!]) {
    getTestItems(order: $order, pagination: $pagination, id: $id) {
      items {
        id
        createdAt
      }
      total
    }
  }
`;

const initialPagination: Pagination = {
  skip: 0,
  take: 5,
};

const mockItems: TestItem[] = range(0, initialPagination.take * 4).map(
  (_, index) => ({
    id: index.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    __typename: 'TestItem',
  })
);

const mocks: MockedResponse[] = [
  {
    request: {
      query,
      variables: {
        pagination: { ...initialPagination },
        order: undefined,
      },
    },
    result: () => ({
      data: {
        getTestItems: {
          items: mockItems.slice(0, initialPagination.take),
          total: mockItems.length,
        },
      },
    }),
  },
  {
    request: {
      query,
      variables: {
        pagination: { ...initialPagination, take: initialPagination.take * 2 },
        order: undefined,
      },
    },
    result: () => ({
      data: {
        getTestItems: {
          items: mockItems.slice(0, initialPagination.take * 2),
          total: mockItems.length,
        },
      },
    }),
  },
  {
    request: {
      query,
      variables: {
        pagination: { ...initialPagination, take: 5 },
        order: undefined,
      },
    },
    result: () => ({
      data: {
        getTestItems: {
          items: mockItems.slice(0, 5),
          total: mockItems.length,
        },
      },
    }),
  },
];

const Wrapper = (
  props: Pick<ControlledListProps, 'paginationType' | 'onDataChange'>
) => {
  return (
    <ThemeProvider>
      <div
        className="wrapper"
        style={{
          height: '400px',
        }}
      >
        <ControlledList<TestItem>
          id="test_controlled_list"
          defaultPagination={initialPagination}
          renderItem={({ item }) => (
            <List key={item.id} className="test-list-item">
              <ListItemText primary={`ID: ${item.id}`} />
            </List>
          )}
          query={query}
          {...props}
        />
      </div>
    </ThemeProvider>
  );
};

const renderCmp = (
  props?: Pick<ControlledListProps, 'paginationType' | 'onDataChange'>
) =>
  render(
    <MockedProvider mocks={mocks} addTypename>
      <Wrapper {...props} />
    </MockedProvider>
  );

const waitForFirstLoad = async (cmp: RenderResult) => {
  await waitFor(() => {
    const listItems = cmp.container.querySelectorAll('.test-list-item');
    expect(listItems).toHaveLength(initialPagination.take);
  });
};

describe('<ControlledList />', () => {
  it('should handle initial query', async () => {
    const cmp = renderCmp();

    await waitForFirstLoad(cmp);
  });

  it('should support infinite scrolling', async () => {
    const cmp = renderCmp({
      paginationType: 'scroll',
    });

    await waitForFirstLoad(cmp);

    const list = cmp.container.querySelector('.controlled-list');

    act(() => {
      fireEvent.scroll(list!, {
        scrollY: 400,
      });
    });

    const newTake = initialPagination.take * 2;

    await waitFor(() => {
      const listItems = cmp.container.querySelectorAll('.test-list-item');
      expect(listItems).toHaveLength(newTake);
    });
  });

  it('should support normal pagination', async () => {
    const onDataChange = jest.fn();
    const cmp = renderCmp({
      paginationType: 'pagination',
      onDataChange,
    });

    await waitForFirstLoad(cmp);

    const paginationItem = cmp.container.querySelector(
      '[aria-label="Go to page 2"]'
    );

    act(() => {
      userEvent.click(paginationItem!);
    });

    const newTake = 5;

    await waitFor(() => {
      const listItems = cmp.container.querySelectorAll('.test-list-item');
      expect(listItems).toHaveLength(newTake);
    });

    expect(onDataChange).toHaveBeenCalledTimes(3);
  });
});
