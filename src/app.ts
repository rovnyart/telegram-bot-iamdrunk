import * as dotenv from 'dotenv';
import { TelegramService } from './services/bot';
import { DbService } from './services/db';
import { config } from './config';

dotenv.config({ path: __dirname + '/.env' });

const run = async () => {
  const dbService = new DbService(config);
  await dbService.connect();

  const bot = new TelegramService(config.telegram.token, dbService);

  await bot.run();
};

run().catch(console.error);
