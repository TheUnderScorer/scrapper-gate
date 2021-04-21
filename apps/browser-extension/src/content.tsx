import { sendMessageToBackground } from './extension/browser/communication/sendMessageToBackground';
import { MessageTypes } from './extension/browser/communication/types';
import { logger } from '@scrapper-gate/frontend/logger';

let didInit = false;

async function createContentScript() {
  if (didInit) {
    return;
  }

  logger.debug('Sending message');

  await sendMessageToBackground({
    type: MessageTypes.InjectContentScript,
  });
}

function main() {
  if (didInit) {
    return;
  }

  setTimeout(() => {
    logger.debug('Fix for emotion styles...');

    const emotion10Styles = document.querySelectorAll(
      `style[data-emotion]:not([data-s])`
    );

    emotion10Styles.forEach((node) => {
      node.setAttribute('data-s', '');
      node.removeAttribute('data-emotion');
    });

    logger.debug('Fix for emotion styles done ;)');

    createContentScript().then(() => console.log('Content script loaded'));

    didInit = true;
  }, 250);
}

main();
