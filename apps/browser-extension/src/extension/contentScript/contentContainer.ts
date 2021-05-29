export const contentContainer = document.createElement('div');

contentContainer.id = 'scrapper_gate_content_root';
contentContainer.setAttribute('role', 'presentation');

document.addEventListener('select', () => {
  const selection = document.getSelection();

  contentContainer.setAttribute(
    'data-offset-key',
    selection.focusOffset.toString()
  );
});
