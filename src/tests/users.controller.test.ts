import { Context } from 'koa';
import { listUsers, editAccount } from '../controllers/users.controller';
import { User } from '../entities/user';
import AppDataSource from '../database/data-source';

// Mock do AppDataSource e Repository
jest.mock('../database/data-source', () => ({
  getRepository: jest.fn(),
}));

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

describe('users Controller', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    ctx = {
      request: {
        body: {},
      } as any,
      state: {
        user: { email: 'test@example.com', scope: [] },
      } as any,
      status: undefined,
      body: undefined,
    };
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of users ordered by id', async () => {
      const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      mockRepository.find.mockResolvedValue(users);

      await listUsers(ctx as Context);

      expect(mockRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
      expect(ctx.body).toEqual({ users });
    });
  });

  describe('editAccount', () => {
    it('should return 404 if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await editAccount(ctx as Context);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({ message: 'User not found' });
    });

    it('should return 403 if non-admin tries to change role', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test', role: 'user' };
      ctx.request!.body = { name: 'New Name', role: 'admin' };
      ctx.state!.user!.scope = []; // Non-admin
      mockRepository.findOne.mockResolvedValue(user);

      await editAccount(ctx as Context);

      expect(ctx.status).toBe(403);
      expect(ctx.body).toEqual({ message: 'You do not have permission to change your role.' });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should allow admin to change name and role', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test', role: 'user' };
      const updatedUser = { ...user, name: 'New Name', role: 'admin' };
      ctx.request!.body = { name: 'New Name', role: 'admin' };
      ctx.state!.user!.scope = ['admin'];
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue(updatedUser);

      await editAccount(ctx as Context);

      expect(user.name).toBe('New Name');
      expect(user.role).toBe('admin');
      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(ctx.body).toEqual({ user: updatedUser });
    });

    it('should allow non-admin to change name and set isOnboarded to true', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
        isOnboarded: false,
      };
      const updatedUser = { ...user, name: 'New Name', isOnboarded: true };
      ctx.request!.body = { name: 'New Name' };
      ctx.state!.user!.scope = []; // Non-admin
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue(updatedUser);

      await editAccount(ctx as Context);

      expect(user.name).toBe('New Name');
      expect(user.isOnboarded).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(ctx.body).toEqual({ user: updatedUser });
    });
  });
});
