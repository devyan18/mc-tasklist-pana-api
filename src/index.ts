import { bootstrap } from './app';
import { startConnection } from './database/connection';
import { config } from './settings/config';
import { syncDb } from './database/sync';

async function main() {
  await startConnection(config.uri).then(() => syncDb());

  const app = await bootstrap();

  app.listen(config.port, '0.0.0.0', () => {
    console.log('NODE ENV:', config.nodeEnv);

    console.log(`Server is running on port ${config.port}`);
  });
}

main();
