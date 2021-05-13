import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { PopupScrappersView } from './PopupScrappersView';
import { act, render, waitFor } from '@testing-library/react';
import { Tabs } from 'webextension-polyfill-ts';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import {
  MyScrappersQuery,
  MyScrappersQueryVariables,
} from '@scrapper-gate/shared/schema';
import { initialPagination } from '@scrapper-gate/frontend/ui';
import { createMockScrapper } from '@scrapper-gate/shared/domain/scrapper';
import userEvent from '@testing-library/user-event';
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension';
import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import {
  MessageTypes,
  StoredRoute,
} from '../../../extension/browser/communication/types';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';

const scrapper = createMockScrapper();
scrapper.name = 'Test';

const defaultMocks: MockedResponse[] = [
  {
    request: {
      query: MyScrappersDocument,
      variables: {
        pagination: initialPagination,
        order: undefined,
      } as MyScrappersQueryVariables,
    },
    result: {
      data: {
        getMyScrappers: {
          total: 1,
          items: [scrapper],
        },
      } as MyScrappersQuery,
    },
  },
];

const mountCmp = (mocks = defaultMocks) => {
  return render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider>
        <PopupScrappersView fetchPolicy="network-only" />
      </ThemeProvider>
    </MockedProvider>
  );
};

const waitForListItem = async (container: HTMLElement) => {
  await waitFor(
    () => {
      const listItem = container.querySelector('.scrapper-list-item');

      return expect(listItem).not.toBeNull();
    },
    {
      interval: 250,
      timeout: 3000,
    }
  );
};

const mockTab = {
  id: 1,
  windowId: 1,
};

const tokens = {
  accessToken: '#access',
  refreshToken: '#refresh',
};

function defaultStoreMock() {
  mockBrowser.storage.local.get.mock(async () => ({
    contentRoutes: {
      [mockTab.id]: {},
    },
  }));
}

describe('Popup scrappers view', () => {
  let onMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>;

  beforeEach(() => {
    onMessage = mockEvent(mockBrowser.runtime.onMessage);
    mockBrowser.tabs.query.mock(async () => [mockTab as Tabs.Tab]);

    useTokensStore.setState({
      tokens,
    });
  });

  it('should render without crashing', async () => {
    defaultStoreMock();

    const cmp = mountCmp();

    await waitForListItem(cmp.container);

    expect(cmp).toMatchSnapshot();
  });

  it('should send message to content after clicking scrapper', async () => {
    defaultStoreMock();

    const sendMessage = jest.fn();
    mockBrowser.runtime.sendMessage.mock((...args) => sendMessage(...args));

    const cmp = mountCmp();

    await waitForListItem(cmp.container);

    const listItem = cmp.container.querySelector('.scrapper-list-item');

    act(() => {
      userEvent.click(listItem);
    });

    expect(sendMessage).toHaveBeenCalledWith({
      payload: {
        tokens,
        visible: true,
        path: browserExtensionRoutes.content.scrapper({
          scrapperId: scrapper.id,
          drawerOpen: true,
        }),
      },
      type: MessageTypes.ToggleContent,
    });
  });

  it('should send message that closes content if user clicks active scrapper', async () => {
    const sendMessage = jest.fn();
    mockBrowser.runtime.sendMessage.mock((...args) => sendMessage(...args));

    mockBrowser.storage.local.get.mock(async () => ({
      contentRoutes: {
        [mockTab.id]: {
          pathname: browserExtensionRoutes.content.scrapper({
            scrapperId: scrapper.id,
            drawerOpen: true,
          }),
        } as StoredRoute,
      },
    }));

    const cmp = mountCmp();

    await waitForListItem(cmp.container);

    const listItem = cmp.container.querySelector('.scrapper-list-item');

    act(() => {
      userEvent.click(listItem);
    });

    expect(sendMessage).toHaveBeenCalledWith({
      payload: {
        tokens,
        visible: false,
        path: '/',
      },
      type: MessageTypes.ToggleContent,
    });
  });
});
