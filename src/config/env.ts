import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  cognito: {
    region: process.env.COGNITO_REGION || '',
    userPoolId: process.env.COGNITO_USER_POOL_ID || '',
    clientId: process.env.COGNITO_CLIENT_ID || '',
    allowedScopes: (process.env.COGNITO_ALLOWED_SCOPES || 'admin,user').split(','),
  },
};

export default env;
