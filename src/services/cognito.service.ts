import { CognitoJwtVerifier } from 'aws-jwt-verify';
import env from '../config/env';

const verifier = CognitoJwtVerifier.create({
  userPoolId: env.cognito.userPoolId,
  tokenUse: 'id',
  clientId: env.cognito.clientId,
});

export async function verifyToken(token: string) {
  const payload = await verifier.verify(token);
  return {
    sub: payload.sub as string,
    email: (payload.email as string) || '',
    scope: ((payload['cognito:groups'] as string[]) || []).map((s) => s.toLowerCase()),
    raw: payload,
  };
}
