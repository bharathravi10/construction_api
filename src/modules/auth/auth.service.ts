import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // -------------------------------
  // Validate user credentials
  // -------------------------------
  async validateUser(identifier: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
      is_deleted: false,
    })
      .select('_id name email mobile password') // select only necessary fields
      .populate('role', '_id name') // populate role with only _id and name
      .exec();

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // -------------------------------
  // Generate Access & Refresh Tokens
  // -------------------------------
  getTokens(user: UserDocument) {
    const role = user.role as { _id: string; name: string } | string | undefined;

    const payload = {
      sub: user._id.toString(), // user ID
      role: typeof role === 'object' ? role._id : role,
      roleName: typeof role === 'object' ? role.name : undefined,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // -------------------------------
  // Login logic
  // -------------------------------
  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email/mobile or password');
    }

    const tokens = this.getTokens(user);

    // Exclude password before returning user object
    const { password: _, ...userData } = user.toObject();

    return {
      message: 'Login successful',
      user: userData,
      ...tokens,
    };
  }

  // -------------------------------
  // Refresh token logic
  // -------------------------------
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });

      const user = await this.userModel.findById(payload.sub)
        .select('_id name email mobile')
        .populate('role', '_id name');

      if (!user || user.is_deleted) {
        throw new UnauthorizedException('User not found or deleted');
      }

      const tokens = this.getTokens(user);

      const { password: _, ...userData } = user.toObject();

      return {
        message: 'Token refreshed',
        user: userData,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
