import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YoutubeService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
  }

  async getAllChannelVideos(channelId: string): Promise<any[]> {
    let videos = [];
    let nextPageToken = '';
    do {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;
      const response = await this.httpService.get(url).toPromise();
      const items = response.data.items.filter(
        (item) => item.id.kind === 'youtube#video',
      );

      const videoIds = items.map((video) => video.id.videoId).join(',');

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${videoIds}&part=snippet,statistics`;
      const videoDetailsResponse = await this.httpService
        .get(videoDetailsUrl)
        .toPromise();

      videos = videos.concat(
        videoDetailsResponse.data.items.map((video) => ({
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          viewCount: video.statistics.viewCount,
        })),
      );

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
    return videos;
  }

  async getVideoDetails(videoId: string): Promise<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${videoId}&part=snippet,statistics`;
    const response = await firstValueFrom(this.httpService.get(url));
    const video = response.data.items[0];
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      viewCount: video.statistics.viewCount,
    };
  }

  async getChannelDetails(channelId: string): Promise<any> {
    const url = `https://www.googleapis.com/youtube/v3/channels?key=${this.apiKey}&id=${channelId}&part=snippet,statistics`;
    const response = await firstValueFrom(this.httpService.get(url));
    const channel = response.data.items[0];
    return {
      channelId: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount,
      viewCount: channel.statistics.viewCount,
    };
  }
}
