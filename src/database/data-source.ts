import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user';
import env from '../config/env';

const url = env.DATABASE_URL;

const AppDataSource = url
  ? new DataSource({
      type: 'postgres',
      url,
      ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      entities: [User],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false,
    })
  : new DataSource({
      type: 'postgres',
      host: env.database.host,
      port: Number(env.database.port),
      username: env.database.username,
      password: env.database.password,
      database: env.database.name,
      entities: [User],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false,
    });

export default AppDataSource;
