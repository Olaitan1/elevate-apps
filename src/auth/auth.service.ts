import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findUserByemail(email);
    if (user) {
      return user;
    }
    return null;
  }

  async signIn(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload);
  }
  async logout(token: string): Promise<void> {
    try {
      // Verify and decode the JWT token
      const decodedToken = this.jwtService.verify(token);

      // Implement your logout logic here
      // For example, you can blacklist the token or clear session data
      // In this example, we assume a token blacklist implementation

      // Add the token to the blacklist (e.g., store in database or cache)
      await this.addToTokenBlacklist(token);

      // Return successfully
      return;
    } catch (error) {
      // If the token is invalid or expired, throw an unauthorized exception
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async addToTokenBlacklist(token: string): Promise<void> {
    // Implement your logic to store the token in a blacklist (e.g., database or cache)
    // Here, we simply print a message to indicate the token has been blacklisted
    console.log(`Token blacklisted: ${token}`);
  }
  
}
