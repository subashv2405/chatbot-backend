import { UsersController } from './users.controller';

describe('UsersController', () => {
  it('should be defined', () => {
    const controller = new UsersController();
    expect(controller).toBeDefined();
  });
});
