import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get('channel/:channelId/videos')
  @ApiOperation({ summary: 'Get all videos from a channel by Channel ID' })
  @ApiParam({
    name: 'channelId',
    type: String,
    description: 'YouTube Channel ID',
  })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getChannelVideosByChannelId(@Param('channelId') channelId: string) {
    return this.youtubeService.getAllChannelVideos(channelId);
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: 'Get channel details by channel ID' })
  @ApiParam({
    name: 'channelId',
    type: String,
    description: 'YouTube Channel ID',
  })
  @ApiResponse({ status: 200, description: 'Channel details' })
  async getChannelDetails(@Param('channelId') channelId: string) {
    return this.youtubeService.getChannelDetails(channelId);
  }
}
