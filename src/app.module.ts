import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserSchema } from './user/user.schema';
import { UsersModule } from './user/user.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './user/user.service';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/elevate-apps"),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    AuthModule,
    AnalyticsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
  ],

  controllers: [],
  providers: [JwtAuthGuard, AuthModule, UsersService],
})
export class AppModule {}
