export type Config = {
  telegram: {
    token: string;
  };
  mongo: {
    uri: string;
  };
};

export const config: Config = {
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/imdrunk',
  },
};
