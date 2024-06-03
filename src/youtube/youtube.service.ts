import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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

  async getChannelIdByChannel(Channel: string): Promise<string> {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&q=${Channel}&type=channel&part=id`;
    const response = await firstValueFrom(this.httpService.get(url));
    if (response.data.items.length === 0) {
      throw new Error('Channel not found');
    }
    return response.data.items[0].id.channelId;
  }

  async getAllChannelVideos(channelId: string): Promise<any[]> {
    let videos = [];
    let nextPageToken = '';
    do {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;
      const response = await this.httpService.get(url).toPromise();
      const items = response.data.items.filter(item => item.id.kind === 'youtube#video');
      videos = videos.concat(items.map(video => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
      })));
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
}
