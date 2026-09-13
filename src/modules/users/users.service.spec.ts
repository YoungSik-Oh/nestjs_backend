import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findOneOrFail: jest.fn(),
  findAndCount: jest.fn(),
});

type MockRepository = ReturnType<typeof mockRepository>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository;

  const user: User = {
    uuid: 'uuid-1',
    userID: 'tester',
    name: '테스터',
    pwd: 'hashed',
    email: 'tester@example.com',
    phone: '010-0000-0000',
    authority: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    boards: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('비밀번호를 해시하여 저장한다', async () => {
      const dto: CreateUserDto = {
        userID: 'tester',
        name: '테스터',
        pwd: 'plain-password',
        email: 'tester@example.com',
        phone: '010-0000-0000',
      };
      repository.create.mockImplementation((data) => data);
      repository.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.createUser(dto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result.pwd).not.toBe('plain-password');
      expect(await bcrypt.compare('plain-password', result.pwd)).toBe(true);
    });
  });

  describe('findOneUser', () => {
    it('uuid로 유저를 조회한다', async () => {
      repository.findOneOrFail.mockResolvedValue(user);

      const result = await service.findOneUser('uuid-1');

      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: { uuid: 'uuid-1' },
      });
      expect(result).toEqual(user);
    });

    it('존재하지 않는 유저는 NotFoundException을 던진다', async () => {
      repository.findOneOrFail.mockRejectedValue(new Error('not found'));

      await expect(service.findOneUser('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('전달된 필드로 유저를 갱신하고 갱신된 유저를 반환한다', async () => {
      const updated = { ...user, name: '변경된 이름' };
      repository.findOneOrFail
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(updated);
      repository.update.mockResolvedValue(undefined);

      const result = await service.updateUser('uuid-1', {
        name: '변경된 이름',
      });

      expect(repository.update).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ name: '변경된 이름', pwd: user.pwd }),
      );
      expect(result.name).toBe('변경된 이름');
    });

    it('존재하지 않는 유저 갱신은 NotFoundException을 던진다', async () => {
      repository.findOneOrFail.mockRejectedValue(new Error('not found'));

      await expect(
        service.updateUser('missing', { name: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('조회된 유저를 삭제한다', async () => {
      repository.findOneOrFail.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);

      const result = await service.deleteUser('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});
