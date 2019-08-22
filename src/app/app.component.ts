import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {


  title = 'infoscreen';

  private contentImages = [];
  private mixinImages = [];
  private tickerList = [];

  public img = '';
  public ticker = '';

  private imgNr = 0;
  private tickerNr = 0;

  private mixinImgNr = 0;
  private mixinCnt = 0;
  private mixinRate = 0;
  private isMixin = false;


  private lastImgTime = 0;
  private lastTickerTime = 0;
  private timer: Observable<number>;

  //@ViewChild('imgarea') imgelem;


  constructor( private config: ConfigService) {
    this.update();
   
    // Periodically update the information displayed on the page

    this.timer = interval(1*1000);
    this.timer.subscribe((t) => {
      this.update();
    });
  }

  ngOnInit() {
    //console.log("onInit");
  }

  onResize(event) {
    //console.log("resize: " + event.target.innerWidth + " " + event.target.innerHeight);
  }

  /*
  ngAfterViewInit() {
    //console.log("H: " + this.elementView.nativeElement.offsetHeight);
  }
  */

  buildImgUrl(img) {
    var w = window.innerWidth * 0.85
    var h = window.innerHeight * 0.85

    return img + '?w=' + Math.floor(w) + '&h=' + Math.floor(h);
  }

  nextContentImg() {
    if (this.contentImages.length == 0) {
      return 'assets/empty.png';
    }

    this.imgNr += 1;
    if (this.imgNr >= this.contentImages.length) {
      this.imgNr = 0;
    }

    return this.config.getRepUrl() + this.contentImages[this.imgNr];
  }

  nextMixinImg() {
    if (this.contentImages.length == 0) {
      return '';
    }

    this.mixinImgNr += 1;
    if (this.mixinImgNr >= this.mixinImages.length) {
      this.mixinImgNr = 0;
    }

    return this.config.getRepUrl() + this.mixinImages[this.mixinImgNr];
  }

  nextTickerMsg() {
    if (this.tickerList.length == 0) {
      return "";
    }

    this.tickerNr += 1;
    if (this.tickerNr >= this.tickerList.length) {
      this.tickerNr = 0;
    }

    return this.tickerList[this.tickerNr];
  }

  update(): void {
    var content = this.config.getContent();
    this.contentImages = content.content_images;
    this.tickerList = content.ticker;
    this.mixinImages = content.mixin_images;

    var now = Date.now();

    if (this.isMixin) {
      if (now - this.lastImgTime > 1000*this.config.getMixinImageDisplayDuration()) {
	this.isMixin = false;
	this.mixinCnt = 0;
	this.lastImgTime = now;
	this.img = this.buildImgUrl(this.nextContentImg());
      }
    } else {
      if (now - this.lastImgTime > 1000*this.config.getContentImageDisplayDuration()) {
	this.mixinCnt += 1;
	if (this.config.getMixinImageRate() > 0 && this.mixinCnt >= this.config.getMixinImageRate() && this.mixinImages.length > 0) {
	  this.isMixin = true;
	  this.img = this.buildImgUrl(this.nextMixinImg());
	} else {
	  this.img = this.buildImgUrl(this.nextContentImg());
	}
	this.lastImgTime = now;
      }
    }

    if (now - this.lastTickerTime > 1000*this.config.getTickerDisplayDuration()) {
      this.lastTickerTime = now;
      this.ticker = this.nextTickerMsg();
    }
  }


}
