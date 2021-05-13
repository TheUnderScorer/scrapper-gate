import { range } from 'remeda';
import { useState } from 'react';
import { List, ListItem } from '@material-ui/core';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTextField } from '../FilterTextField/FilterTextField';

interface TestItem {
  title: string;
  id: string;
}

const items: TestItem[] = range(0, 9).map((_, index) => ({
  title: `Item ${index}`,
  id: `#item_${index}`,
}));

const Component = (props: { filterKeys: Array<keyof TestItem> }) => {
  const [filteredItems, setFilteredItems] = useState(items);

  return (
    <>
      <FilterTextField
        items={items}
        onItemsChange={setFilteredItems}
        filterKeys={props.filterKeys}
      />
      <List>
        {filteredItems.map((item) => (
          <ListItem className="test-item" key={item.id} id={item.id}>
            {item.title}
          </ListItem>
        ))}
      </List>
    </>
  );
};

describe('<FilterTextField />', () => {
  it('should render without crashing', () => {
    const cmp = render(<Component filterKeys={['title']} />);

    expect(cmp).toMatchSnapshot();
  });

  it.each([
    ['title', 'Item 1'],
    ['id', '#item_3'],
  ])('should filter items', async (filterKey, text) => {
    const cmp = render(
      <Component filterKeys={[filterKey as keyof TestItem]} />
    );

    const field = cmp.container.querySelector('.filter-text-field input');

    act(() => {
      userEvent.type(field, text);
    });

    const testItems = cmp.container.querySelectorAll('.test-item');

    expect(testItems).toHaveLength(1);
  });
});
