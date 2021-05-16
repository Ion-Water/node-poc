import { config } from 'dotenv';

config();

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: ['src/entities/*.ts'],
  migrationsTableName: 'typeorm_mgirations',
  migrations: ['database/migration/*.ts'],
  cli: {
    migrationsDir: 'database/migration',
  },
};
