jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  verify: jest.fn().mockResolvedValue(true),
}));

import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';
import * as jwtoken from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, ConfigService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signup', () => {
    it('should create a new user if email is from ilara.io domain', async () => {
      const authDto = {
        email: 'john.doe@ilara.io',
        department_id: 1,
        msisdn: '1234567890',
        identification_number: '123456',
        employee_names: 'John Doe',
        password: 'test123',
      };

      const hashSpy = jest
        .spyOn(argon, 'hash')
        .mockResolvedValue('hashed_password');
      const createSpy = jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValue({
          id: 1,
          department_id: 1,
          employee_names: 'John Doe',
          identification_number: '123456',
          msisdn: '1234567890',
          email: 'john.doe@ilara.io',
          password: null, // or undefined
          refresh_token: null,
          created_by: null, // or undefined
          created_at: null, // or undefined
          updated_by: null, // or undefined
          updated_at: null, // or undefined
          status: true,
        });

      const result = await authService.signup(authDto);

      expect(hashSpy).toHaveBeenCalledWith(authDto.password);
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          email: authDto.email,
          department_id: authDto.department_id,
          msisdn: authDto.msisdn,
          identification_number: authDto.identification_number,
          employee_names: authDto.employee_names,
          password: 'hashed_password',
          status: true,
        },
      });
      expect(result).toEqual({
        id: expect.any(Number),
        department_id: authDto.department_id,
        employee_names: authDto.employee_names,
        identification_number: authDto.identification_number,
        msisdn: authDto.msisdn,
        email: authDto.email,
        status: true,
      });
    });

    it('should throw a ForbiddenException if email is not from ilara.io domain', async () => {
      const authDto = {
        email: 'john.doe@example.com',
        department_id: 1,
        msisdn: '1234567890',
        identification_number: '123456',
        employee_names: 'John Doe',
        password: 'test123',
      };

      await expect(authService.signup(authDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('signin', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return an access token if user exists and password matches', async () => {
      const authSigninDto = {
        email: 'john.doe@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        department_id: 1,
        employee_names: 'John Doe',
        email: 'john.doe@example.com',
        identification_number: '1234567890',
        msisdn: '+1234567890',
        password: await argon.hash('password'),
        status: true,
        refresh_token: null,
        created_by: null, // or undefined
        created_at: null, // or undefined
        updated_by: null, // or undefined
        updated_at: null, // or undefined
      };

      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(user);
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(async () => Promise.resolve(true));
      jest.spyOn(authService, 'JwtSignToken').mockResolvedValue({
        access: 'access_token',
        refresh: 'refresh_token',
      });

      const result = await authService.signin(authSigninDto);

      expect(result).toHaveProperty('access');
      expect(prismaService.users.findUnique).toHaveBeenCalledTimes(1);
      expect(argon.verify).toHaveBeenCalledTimes(1);
      expect(authService.JwtSignToken).toHaveBeenCalledTimes(1);
    });
  });
});
