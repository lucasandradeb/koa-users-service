import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user';

const url = process.env.DATABASE_URL;

export const AppDataSource = url
  ? new DataSource({
      type: 'postgres',
      url,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      entities: [User],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false
    })
  : new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false
    });

export default AppDataSource;
