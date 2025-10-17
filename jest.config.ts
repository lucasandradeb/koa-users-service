import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/controllers/*.ts',
    'src/middleware/*.ts',
    'src/services/*.ts',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: [],
};

export default config;
