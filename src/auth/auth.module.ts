import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
