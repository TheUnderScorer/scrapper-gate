import { logger } from '@scrapper-gate/shared/logger/console';
import browser from 'webextension-polyfill';
import { MessageTypes } from '../../extension/browser/communication/messageResult.types';
import { sendMessageToBackground } from '../../extension/browser/communication/sendMessageToBackground';

let didInit = false;

const port = browser.runtime.connect({
  name: 'test',
});

logger.debug('Connected to port:', port.name);

port.onMessage.addListener((message) => {
  logger.debug('Received message from port:', message);
});

port.postMessage({
  test: true,
});

async function createContentScript() {
  if (didInit) {
    return;
  }

  logger.debug('Sending message');

  await sendMessageToBackground({
    type: MessageTypes.InjectContentScript,
  });
}

function fixEmotionStyles() {
  logger.debug('Fix for emotion styles...');

  const emotion10Styles = document.querySelectorAll(
    `style[data-emotion]:not([data-s])`
  );

  logger.debug(`Found ${emotion10Styles.length} emotion styles.`);

  emotion10Styles.forEach((node) => {
    node.setAttribute('data-s', '');
    node.removeAttribute('data-emotion');
  });

  logger.debug('Fix for emotion styles done ;)');
}

function main() {
  if (didInit) {
    return;
  }

  setTimeout(() => {
    fixEmotionStyles();

    createContentScript().then(() => logger.debug('Content script loaded'));

    didInit = true;
  }, 250);
}

main();
