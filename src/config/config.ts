const APP_NAME = 'someone';

export default () => {
  const env = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';

  return {
    server: {
      port: parseInt(process.env.PORT, 10) || 3010,
    },
    logger: {
      filename: APP_NAME,
      dirname: `/logs/${env}/console`,
    },
    database: {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: true,
      logger: {
        filename: APP_NAME,
        dirname: `/logs/${env}/query`,
      },
    },
    resource: {
      savePath: '/public',
      baseUrl: '/public',
    },
  };
};
