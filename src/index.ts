import { bootstrap } from './app';
import { startConnection } from './database/connection';
import { config } from './settings/config';

async function main() {
  await startConnection(config.uri);

  const app = await bootstrap();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

main();
