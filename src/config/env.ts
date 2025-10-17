import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  cognito: {
    domain: process.env.COGNITO_DOMAIN || '',
    region: process.env.COGNITO_REGION || '',
    userPoolId: process.env.COGNITO_USER_POOL_ID || '',
    clientId: process.env.COGNITO_CLIENT_ID || '',
    allowedScopes: (process.env.COGNITO_ALLOWED_SCOPES || 'admin,user').split(','),
  },
  DATABASE_URL: process.env.DATABASE_URL || '',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    name: process.env.DB_NAME || 'users_db',
  },
};

export default env;
