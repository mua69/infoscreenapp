import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {ConfigService} from '../config.service';
import {max} from 'rxjs/operators';

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

  private contentImages = [];
  private mixinImages = [];
  private imgNr = 0;
  private mixinImgNr = 0;
  private mixinCnt = 0;
  private mixinRate = 0;
  private isMixin = false;
  private displayDuration = 0;

  private timer: Observable<number>;

  constructor(public config: ConfigService) {
    this.setUpdateTimer(5);
    this.config.contentLoaded$.subscribe(dummy => { this.getContent(); });
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

  isVideoFile(src) {
      for (const ext of this.config.getVideoExtensions()) {
        if (src.endsWith(ext)) {
          return true;
        }
      }
      return false;
  }

  getContent() {
    const content = this.config.getContent();
    switch (this.contentStream) {
      case 'c1':
        this.contentImages = content.content_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'c2':
        this.contentImages = content.content2_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'c3':
        this.contentImages = content.content3_images;
        this.displayDuration = this.config.getContentImageDisplayDuration();
        break;
      case 'd1':
        this.contentImages = content.mixin_images;
        this.displayDuration = this.config.getMixinImageDisplayDuration();
        break;
      default:
        console.log('ContentComponent: invalid content stream id');
        this.displayDuration = 2;
        this.contentImages = [];
        break;
    }
    if (this.mixin) {
      this.mixinImages = content.mixin_images;
      this.mixinRate = this.config.getMixinImageRate();
    }
  }

  buildImgUrl(img) {
    return img + '?w=' + Math.floor(this.imgWidth) + '&h=' + Math.floor(this.imgHeight);
  }

  nextContentImg() {
    if (this.contentImages === null || this.contentImages.length === 0) {
      return 'assets/empty.png';
    }

    this.imgNr += 1;
    if (this.imgNr >= this.contentImages.length) {
      this.imgNr = 0;
    }

    return this.config.getRepUrl() + this.contentImages[this.imgNr];
  }

  nextMixinImg() {
    if (this.mixinImages === null || this.mixinImages.length === 0) {
      return 'assets/empty.png';
    }

    this.mixinImgNr += 1;
    if (this.mixinImgNr >= this.mixinImages.length) {
      this.mixinImgNr = 0;
    }

    return this.config.getRepUrl() + this.mixinImages[this.mixinImgNr];
  }

  update(): void {
    let src: string;

    if (this.isMixin) {
      this.mixinCnt += 1;
      if (this.mixinCnt >= this.mixinRate || this.mixinCnt >= this.mixinImages.length) {
        this.isMixin = false;
        src = this.nextContentImg();
      } else {
        src = this.nextMixinImg();
      }
    } else {
      if (this.mixin && this.imgNr >= this.contentImages.length - 1) {
        this.isMixin = true;
        this.mixinCnt = 0;
        src = this.nextMixinImg();
      } else {
        src = this.nextContentImg();
      }
    }

    if (this.isVideoFile(src)) {
      this.videoPlayer.nativeElement.style.display = "block";
      this.image.nativeElement.style.display = "none";
      this.videoPlayer.nativeElement.volume = 0;
      this.videoPlayer.nativeElement.src = src;
      this.videoPlayer.nativeElement.play();
      let maxVideoDuration = this.config.getMaxVideoDuration();
      if (maxVideoDuration > 0) {
        this.setUpdateTimer(maxVideoDuration);
      }
    } else {
      this.videoPlayer.nativeElement.style.display = "none";
      this.image.nativeElement.style.display = "block";
      this.img = this.buildImgUrl(src);
      if (this.isMixin) {
        this.setUpdateTimer(this.config.getMixinImageDisplayDuration());
      } else {
        this.setUpdateTimer(this.displayDuration);
      }
    }
  }

}
