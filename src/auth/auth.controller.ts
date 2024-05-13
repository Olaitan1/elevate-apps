import { Controller, Post, Body, UseGuards , Headers} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body('email') email: string) {
    const user = await this.authService.validateUser(email);
    if (!user) {
      return { error: 'User not found' };
    }
    const token = await this.authService.signIn(email);
    return { token };
  }
   @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Headers('Authorization') authorization: string) {
    // Extract the token from the authorization header
    const token = authorization.split(' ')[1];
    await this.authService.logout(token);
  }
}
