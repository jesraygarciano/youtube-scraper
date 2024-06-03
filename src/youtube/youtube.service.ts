import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
  }

  async getChannelIdByUsername(username: string): Promise<string> {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${this.apiKey}&forUsername=${username}&part=id`;
    const response = await this.httpService.get(url).toPromise();
    if (response.data.items.length === 0) {
      throw new Error('Channel not found');
    }
    return response.data.items[0].id;
  }

  async getChannelVideos(channelId: string): Promise<any[]> {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`;
    const response = await this.httpService.get(url).toPromise();
    const videos = response.data.items.filter(item => item.id.kind === 'youtube#video');
    return videos.map(video => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
    }));
  }

  async getVideoDetails(videoId: string): Promise<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${videoId}&part=snippet,statistics`;
    const response = await this.httpService.get(url).toPromise();
    const video = response.data.items[0];
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      viewCount: video.statistics.viewCount,
    };
  }
}
