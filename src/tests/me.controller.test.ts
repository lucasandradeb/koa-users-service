import { Context } from 'koa';
import { me } from '../controllers/me.controller';
import { User } from '../entities/user';
import AppDataSource from '../database/data-source';

// Mock do AppDataSource e Repository
jest.mock('../database/data-source', () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe('me Controller', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    ctx = {
      state: {
        user: { email: 'test@example.com' },
      } as any,
      status: undefined,
      body: undefined,
    };
    jest.clearAllMocks();
  });

  it('should return the user if found', async () => {
    const user = { id: 1, email: 'test@example.com', name: 'Test User' };
    mockRepository.findOne.mockResolvedValue(user);

    await me(ctx as Context);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(ctx.status).toBeUndefined(); // Não define status se sucesso
    expect(ctx.body).toEqual({ user });
  });

  it('should return 404 if user not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await me(ctx as Context);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({ message: 'User not found' });
  });
});
