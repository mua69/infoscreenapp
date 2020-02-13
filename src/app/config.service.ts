import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ConfigService {

  private timer: Observable<number>;

  private config: any = {
    screen_config: 1,
    content_image_display_duration: 30,
    ticker_display_duration: 5,
    mixin_image_display_duration: 5,
    mixin_image_rate: 2,

    open_weather_map_url: '',
    open_weather_map_api_key: '',
    open_weather_map_city_id: ''
  };

  private content: any = {
    content_images: [],
    content2_images: [],
    content3_images: [],
    mixin_images: [],
    ticker: [],
    ticker_default: ''
  };

  constructor(private http: HttpClient) {
    this.fetchConfig();
    this.fetchContent();

    this.timer = interval(60 * 1000);
    this.timer.subscribe((t) => {
      this.fetchContent();
    });

  }

  get url(): string {
    if (environment.production) {
      return location + 'api';
    } else {
      return 'http://192.168.0.22:4201/api';
    }
  }

  fetchConfig() {
    // console.log('ConfigService: fetch config');
    this.http.get(`${this.url}/config`).subscribe((data: any) => { this.config = data; });
  }

  fetchContent() {
    this.http.get(`${this.url}/content`).subscribe((data: any) => { this.content = data; });
  }

  getScreenConfig() {
    return this.config.screen_config;
  }

  getContentImageDisplayDuration() {
    return this.config.content_image_display_duration;
  }


  getMixinImageDisplayDuration() {
    return this.config.mixin_image_display_duration;
  }

  getMixinImageRate() {
    return this.config.mixin_image_rate;
  }

  getTickerDisplayDuration() {
    return this.config.ticker_display_duration;
  }

  getOpenWeatherMapUrl() {
    return this.config.open_weather_map_url;
  }

  getOpenWeatherMapApiKey() {
    return this.config.open_weather_map_api_key;
  }

  getOpenWeatherMapCityId() {
    return this.config.open_weather_map_city_id;
  }

  getContent() {
    return this.content;
  }

  getRepUrl() {
    return `${this.url}/rep/`;
  }

}
