import { logger } from '@scrapper-gate/shared/logger/console';
import { MessageTypes } from './extension/browser/communication/messageResult.types';
import { sendMessageToBackground } from './extension/browser/communication/sendMessageToBackground';

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

    logger.debug(`Found ${emotion10Styles.length} emotion styles.`);

    emotion10Styles.forEach((node) => {
      node.setAttribute('data-s', '');
      node.removeAttribute('data-emotion');
    });

    logger.debug('Fix for emotion styles done ;)');

    createContentScript().then(() => logger.debug('Content script loaded'));

    didInit = true;
  }, 250);
}

main();
