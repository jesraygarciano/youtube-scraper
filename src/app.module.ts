import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class AppModule {}