import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {
  @Input() contentStream: string;
  @Input() mixin: boolean;
  @Input() imgWidth: number;
  @Input() imgHeight: number;

  @ViewChild('vid') videoPlayer: ElementRef;
  @ViewChild('image') image: ElementRef;

  public img = '';

  private content = [];
  private contentMixin = [];
  private imgNr = -1;
  private mixinImgNr = -1;
  private mixinCnt = 0;
  private mixinRate = 0;
  private isMixin = false;
  private displayDuration = 1;

  private emptyImage = { type: 'i',  repo_url: 'assets/empty.png'};

  private timer: Observable<number>;

  constructor(public config: ConfigService) {
    this.setUpdateTimer(2);
    this.config.contentLoaded$.subscribe(content => { this.getContent(content); });
  }

  setUpdateTimer(secs: number) {
    this.timer = timer(secs * 1000);
    this.timer.subscribe((t) => { this.update(); });
  }

  ngOnInit(): void {
  }

  setImageSize(width, height) {
    this.imgWidth = width;
    this.imgHeight = height;
  }

  getContent(content: any): void {
    //console.log('getContent called');
    switch (this.contentStream) {
      case 'c1':
        this.content = content.content_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'c2':
        this.content = content.content2_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'c3':
        this.content = content.content3_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'd1':
        this.content = content.mixin_images;
        this.displayDuration = this.config.getMixinImageDisplayDuration();
        break;
      default:
        console.log('ContentComponent: invalid content stream id');
        this.displayDuration = 2;
        this.content = [];
        break;
    }
    if (this.mixin) {
      this.contentMixin = content.mixin_images;
      if (this.contentMixin == null) {
        this.contentMixin = [];
      }
      this.mixinRate = this.config.getMixinImageRate();
    }
    this.imgNr = -1;
    this.mixinImgNr = -1;
  }

  buildImgUrl(img) {
    return img + '?w=' + Math.floor(this.imgWidth) + '&h=' + Math.floor(this.imgHeight);
  }

  nextContent() {
    if (this.content === null || this.content.length === 0) {
      return this.emptyImage;
    }

    this.imgNr += 1;
    if (this.imgNr >= this.content.length) {
      this.imgNr = 0;
    }

    return this.content[this.imgNr];
  }

  nextContentMixin() {
    if (this.contentMixin === null || this.contentMixin.length === 0) {
      return this.emptyImage;
    }

    this.mixinImgNr += 1;
    if (this.mixinImgNr >= this.contentMixin.length) {
      this.mixinImgNr = 0;
    }

    return this.contentMixin[this.mixinImgNr];
  }

  update(): void {
    let src: any;

    if (this.isMixin) {
      this.mixinCnt += 1;
      if (this.mixinCnt >= this.mixinRate || this.mixinCnt >= this.contentMixin.length) {
        this.isMixin = false;
        src = this.nextContent();
      } else {
        src = this.nextContentMixin();
      }
    } else {
      if (this.mixin && this.contentMixin.length > 0 && this.imgNr >= this.content.length - 1) {
        this.isMixin = true;
        this.mixinCnt = 0;
        src = this.nextContentMixin();
      } else {
        src = this.nextContent();
      }
    }

    switch (src.type) {
      case 'v':
        this.videoPlayer.nativeElement.style.display = 'block';
        this.image.nativeElement.style.display = 'none';
        this.videoPlayer.nativeElement.volume = 0;
        this.videoPlayer.nativeElement.src = this.config.getRepUrl() + src.repo_url;
        this.videoPlayer.nativeElement.play();
        const maxVideoDuration = this.config.getMaxVideoDuration();
        if (maxVideoDuration > 0) {
          this.setUpdateTimer(maxVideoDuration);
        }
        break;

      case 'i':
        this.videoPlayer.nativeElement.style.display = 'none';
        this.image.nativeElement.style.display = 'block';
        if (src === this.emptyImage) {
          this.img = src.repo_url;
        } else {
          this.img = this.config.getRepUrl() + this.buildImgUrl(src.repo_url);
        }
        if (this.isMixin) {
          this.setUpdateTimer(this.config.getMixinImageDisplayDuration());
        } else {
          this.setUpdateTimer(this.displayDuration);
        }
        break;

      default:
        this.setUpdateTimer(2);
        break;
    }
  }

}
