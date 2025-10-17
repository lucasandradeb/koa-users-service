import { Context, Next } from 'koa';
import { auth } from '../middleware/auth.middleware';
import { verifyToken } from '../services/cognito.service';

// Mock do verifyToken
jest.mock('../services/cognito.service', () => ({
  verifyToken: jest.fn(),
}));

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('auth Middleware', () => {
  let ctx: Partial<Context>;
  let next: Next;

  beforeEach(() => {
    ctx = {
      get: jest.fn(),
      status: undefined,
      body: undefined,
      state: {},
    } as any;
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if Authorization header is missing', async () => {
    (ctx.get as jest.Mock).mockReturnValue(undefined);

    await auth(ctx as Context, next);

    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Missing or invalid Authorization header' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header does not start with Bearer', async () => {
    (ctx.get as jest.Mock).mockReturnValue('Basic token');

    await auth(ctx as Context, next);

    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Missing or invalid Authorization header' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    (ctx.get as jest.Mock).mockReturnValue('Bearer invalidtoken');
    mockVerifyToken.mockRejectedValue(new Error('Invalid token'));

    await auth(ctx as Context, next);

    expect(mockVerifyToken).toHaveBeenCalledWith('invalidtoken');
    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Invalid or expired token', error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set ctx.state.user and call next if token is valid', async () => {
    const user = {
      sub: '123',
      email: 'test@example.com',
      scope: ['user'],
      raw: {} as any, // Adicione 'raw' para corresponder ao tipo
    };
    (ctx.get as jest.Mock).mockReturnValue('Bearer validtoken');
    mockVerifyToken.mockResolvedValue(user);

    await auth(ctx as Context, next);

    expect(mockVerifyToken).toHaveBeenCalledWith('validtoken');
    expect((ctx.state as any).user).toEqual(user); // Use type assertion para ctx.state
    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBeUndefined();
  });
});
