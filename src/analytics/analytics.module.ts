import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsService } from './analytics.service';
import { AnalyticsGateway } from './analytics.gateway';
import { UsersModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), 
  ],
  providers: [AnalyticsGateway, AnalyticsService],
})
export class AnalyticsModule {}
