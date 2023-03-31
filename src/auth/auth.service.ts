import {
  UnauthorizedException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import * as jwtoken from 'jsonwebtoken';

import { AuthDto, AuthSigninDto, AuthRefreshDto } from './dto';

@Injectable()
class AuthService {
  //First initialize prisma service, Config service and JWT Service
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  //Create Sign up Service for the engineers
  async signup(dto: AuthDto) {
    //generate password harsh

    const hashPassword = await argon.hash(dto.password);

    //First make sure the email is ilara.io
    // Split the email address into its username and domain parts
    const [username, domain] = dto.email.split('@');

    // Check if the domain is allowed
    if (domain !== 'ilara.io') {
      throw new ForbiddenException(
        'Sign up is restricted to ilara.io email addresses.',
      );
    }

    try {
      //save the new user to the DB
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          department_id: dto.department_id,
          msisdn: dto.msisdn,
          identification_number: dto.identification_number,
          employee_names: dto.employee_names,
          password: hashPassword,
          status: true,
        },
      });
      //delete the password
      delete user.password;

      //return user;
      return {
        id: user.id,
        department_id: user.department_id,
        employee_names: user.employee_names,
        identification_number: user.identification_number,
        msisdn: user.msisdn,
        email: user.email,
        status: user.status,
      };
    } catch (error) {
      return error;
    }
  }

  async signin(dto: AuthSigninDto) {
    //find the user by ID
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    //If the user does not exist throw an exceptions
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
    //Confirm the password
    const passwordMatch = await argon.verify(user.password, dto.password);

    //If the password is wrong throw an exceptions
    if (!passwordMatch) {
      throw new ForbiddenException('Password does not match');
    }

    //else return a JWT with access and refresh token
    return this.JwtSignToken(
      user.id,
      user.identification_number,
      user.employee_names,
      user.msisdn,
      user.email,
      user.department_id,
    );

    //delete the otp
  }

  async JwtSignToken(
    userId: number,
    identification_number: string,
    employee_names: string,
    msisdn: string,
    email: string,
    department_id: number,
  ): Promise<{ access: string, refresh: string, }> {
    //this will receive the id and id number
    const payload = {
      userId,
      identification_number,
      employee_names,
      msisdn,
      email,
      department_id,
      type: 'access',
    };
    //This will then transform the 2 to JWT
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '16000m',
      secret: secret,
    });

    // Generate refresh token
    const refreshTokenPayload = {
      userId,
      type: 'refresh',
    };

    // This will transform the payload into a JWT refresh token
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
    const refreshToken = await this.jwt.signAsync(refreshTokenPayload, {
      expiresIn: '1d',
      secret: refreshSecret,
    });

    // Store the refresh token in the database for the user
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    return {
      access: token,
      refresh: refreshToken,
    };
  }

  async refreshToken(
    AuthRefreshDto: AuthRefreshDto,
  ): Promise<{ access: string; refresh: string }> {
    try {
      // Verify the refresh token and extract the user ID
      console.log(AuthRefreshDto);
      console.log(
        jwtoken.verify(
          AuthRefreshDto.refresh,
          this.config.get('JWT_REFRESH_SECRET'),
        ),
      );
      const decoded: any = jwtoken.verify(
        AuthRefreshDto.refresh,
        this.config.get('JWT_REFRESH_SECRET'),
      );
      console.log('This is a test');

      const userId = decoded.userId;
      console.log(userId);

      // Check if the user exists in the database
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new ForbiddenException('User does not exist');
      }

      // Check if the user's refresh token matches the one provided
      if (user.refresh_token !== AuthRefreshDto.refresh) {
        throw new ForbiddenException('Invalid refresh token');
      }

      // Generate a new access token
      const accessPayload = {
        userId: user.id,
        identification_number: user.identification_number,
        employee_names: user.employee_names,
        msisdn: user.msisdn,
        email: user.email,
        department_id: user.department_id,
        type: 'access',
      };
      const accessSecret = this.config.get('JWT_SECRET');
      const accessToken = await this.jwt.signAsync(accessPayload, {
        expiresIn: '1600m',
        secret: accessSecret,
      });

      // Generate a new refresh token
      const refreshPayload = {
        userId: user.id,
        type: 'refresh',
      };
      const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
      const newRefreshToken = await this.jwt.signAsync(refreshPayload, {
        expiresIn: '1d',
        secret: refreshSecret,
      });

      // Update the user's refresh token in the database
      await this.prisma.users.update({
        where: { id: user.id },
        data: { refresh_token: newRefreshToken },
      });

      // Return the new access token and refresh token
      return { access: accessToken, refresh: newRefreshToken };
    } catch (error) {
      if (error instanceof jwtoken.TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      } else if (error instanceof jwtoken.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        throw error;
      }
    }
  }
}

export default AuthService;
