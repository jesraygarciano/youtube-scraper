import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('channel/:channelId/videos')
  async getChannelVideos(@Param('channelId') channelId: string) {
    return this.youtubeService.getChannelVideos(channelId);
  }

  @Get('video/:videoId')
  async getVideoDetails(@Param('videoId') videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }

  @Get('username/:username/videos')
  async getChannelVideosByUsername(@Param('username') username: string) {
    const channelId = await this.youtubeService.getChannelIdByUsername(username);
    return this.youtubeService.getChannelVideos(channelId);
  }
}
