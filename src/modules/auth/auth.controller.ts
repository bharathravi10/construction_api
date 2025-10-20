import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------------------
  // Login endpoint
  // -------------------------------
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login using email/mobile and password' })
  @ApiResponse({
    status: 200,
    description: 'Returns user data along with access and refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Invalid email/mobile or password' })
  async login(@Body() loginDto: LoginDto) {
    // Delegates login logic to AuthService
    return this.authService.login(loginDto);
  }

  // -------------------------------
  // Refresh token endpoint
  // -------------------------------
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens along with user data',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    // Delegates refresh token logic to AuthService
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
