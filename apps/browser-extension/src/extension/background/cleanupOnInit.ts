import { cleanupStores } from './cleanupStores';

export const cleanupOnInit = async () => {
  await cleanupStores();
};
