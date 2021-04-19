import { contentContainer } from './extension/contentScript/contentContainer';

let didInit = false;

function main() {
  if (didInit) {
    return;
  }

  setTimeout(() => {
    console.log('Fix for emotion styles...');

    const emotion10Styles = document.querySelectorAll(
      `style[data-emotion]:not([data-s])`
    );

    emotion10Styles.forEach((node) => {
      node.setAttribute('data-s', '');
      node.removeAttribute('data-emotion');
    });

    console.log('Fix for emotion styles done ;)');

    document.body.appendChild(contentContainer);

    import('./app/Content/contentRoot').then(() => {
      console.log('Content script loaded...');
    });

    didInit = true;
  }, 2000);
}

main();
