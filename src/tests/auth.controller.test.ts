import { Context } from 'koa';
import { signInOrRegister } from '../controllers/auth.controller';
import { User } from '../entities/user';
import AppDataSource from '../database/data-source';

// Mock do AppDataSource e Repository
jest.mock('../database/data-source', () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe('signInOrRegister Controller', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    ctx = {
      request: {
        body: {},
      } as any,
      status: undefined,
      body: undefined,
    };
    jest.clearAllMocks();
  });

  it('should return 400 if email is not provided', async () => {
    ctx.request!.body = {};

    await signInOrRegister(ctx as Context);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ message: 'email is required' });
  });

  it('should return existing user if email exists', async () => {
    const existingUser = {
      id: 1,
      email: 'test@example.com',
      name: 'test',
      role: 'user',
      isOnboarded: false,
    };
    ctx.request!.body = { email: 'test@example.com' };
    mockRepository.findOne.mockResolvedValue(existingUser);

    await signInOrRegister(ctx as Context);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(mockRepository.create).not.toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
    expect(ctx.body).toEqual({ user: existingUser });
  });

  it('should create and return new user if email does not exist', async () => {
    const newUser = { email: 'new@example.com', name: 'new', role: 'user', isOnboarded: false };
    const savedUser = { id: 2, ...newUser };
    ctx.request!.body = { email: 'new@example.com' };
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.create.mockReturnValue(newUser);
    mockRepository.save.mockResolvedValue(savedUser);

    await signInOrRegister(ctx as Context);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
    expect(mockRepository.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      name: 'new',
      role: 'user',
      isOnboarded: false,
    });
    expect(mockRepository.save).toHaveBeenCalledWith(newUser);
    expect(ctx.body).toEqual({ user: savedUser });
  });
});
