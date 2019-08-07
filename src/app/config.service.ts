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
    "content_image_display_duration":30,
    "ticker_display_duration": 5,
    "mixin_image_display_duration": 5,
    "mixin_image_rate": 2
  };

  private content: any = {
    "content_images": [],
    "mixin_images": [],
    "ticker": []
  };

  constructor(private http: HttpClient) {
    this.fetchConfig();
    this.fetchContent();

    this.timer = interval(60*1000);
    this.timer.subscribe((t) => {
      this.fetchContent();
    });

  }

  get url() : string {
    if (environment.production) {
      return location + 'api';
    } else {
      return 'http://192.168.0.20:4201/app/api';
    }
  }
			   
  fetchConfig() {
    //console.log('ConfigService: fetch config');
    this.http.get(`${this.url}/config`).subscribe((data: any) => { this.config = data });
  }

  fetchContent() {
    this.http.get(`${this.url}/content`).subscribe((data: any) => { this.content = data });
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

  getContent() {
    return this.content;
  }

  getRepUrl() {
    return `${this.url}/rep/`;
  }
  
}
