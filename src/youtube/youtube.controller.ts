import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { YoutubeService } from './youtube.service';

@ApiTags('YouTube')
@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get video details by video ID' })
  @ApiParam({ name: 'videoId', type: String, description: 'YouTube Video ID' })
  @ApiResponse({ status: 200, description: 'Video details' })
  async getVideoDetails(@Param('videoId') videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }

  @Get('/:Channel/videos')
  @ApiOperation({ summary: 'Get all videos from a channel by custom URL' })
  @ApiParam({ name: 'Channel', type: String, description: 'YouTube Custom URL' })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getChannelVideosByCustomUrl(@Param('Channel') customUrl: string) {
    const channelId = await this.youtubeService.getChannelIdByChannel(customUrl);
    return this.youtubeService.getAllChannelVideos(channelId);
  }
}
