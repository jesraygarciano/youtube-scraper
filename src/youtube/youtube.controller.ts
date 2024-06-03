import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { YoutubeService } from './youtube.service';

@ApiTags('YouTube')
@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('customUrl/:customUrl/videos')
  @ApiOperation({ summary: 'Get all videos from a channel' })
  @ApiParam({ name: 'customUrl', type: String, description: 'YouTube Custom URL' })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getChannelVideosByCustomUrl(@Param('customUrl') customUrl: string) {
    const channelId = await this.youtubeService.getChannelIdByCustomUrl(customUrl);
    return this.youtubeService.getChannelVideos(channelId);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get video details by video ID' })
  @ApiParam({ name: 'videoId', type: String, description: 'YouTube Video ID' })
  @ApiResponse({ status: 200, description: 'Video details' })
  async getVideoDetails(@Param('videoId') videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }

  @Get('channel/:channelId/videos')
  @ApiOperation({ summary: 'Get all videos from a channel by channel ID' })
  @ApiParam({ name: 'channelId', type: String, description: 'YouTube Channel ID' })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getChannelVideos(@Param('channelId') channelId: string) {
    return this.youtubeService.getChannelVideos(channelId);
  }

  @Get('username/:username/videos')
  @ApiOperation({ summary: 'Get all videos from a channel by username' })
  @ApiParam({ name: 'username', type: String, description: 'YouTube Username' })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getChannelVideosByUsername(@Param('username') username: string) {
    const channelId = await this.youtubeService.getChannelIdByUsername(username);
    return this.youtubeService.getChannelVideos(channelId);
  }


}
