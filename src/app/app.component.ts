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

  private tickerList = [];
  private  tickerDefault = '';

  public ticker = '';
  public tickerAlert = false;

  public imgWidth = 100;
  public imgHeight = 100;

  private tickerNr = 0;

  private lastTickerTime = 0;
  private timer: Observable<number>;

  // @ViewChild('imgarea') imgelem;


  constructor( public config: ConfigService) {
    this.update();

    // Periodically update the information displayed on the page

    this.timer = interval(1 * 1000);
    this.timer.subscribe((t) => {
      this.update();
    });
  }

  ngOnInit() {
    // console.log("onInit");
  }

  onResize(event) {
    // console.log("resize: " + event.target.innerWidth + " " + event.target.innerHeight);
    this.setImageSize();
  }

/*
  ngAfterViewInit() {
    //console.log("H: " + this.elementView.nativeElement.offsetHeight);
  }
*/

  setImageSize() {
    let w = window.innerWidth * 0.87;
    let h = window.innerHeight * 0.87;

    if (this.config.getScreenConfig() === 4) {
      w *= 0.5;
      h *= 0.5;
    }

    this.imgWidth = Math.floor(w);
    this.imgHeight = Math.floor(h);
  }

  nextTickerMsg() {
    if (this.tickerList === null || this.tickerList.length === 0) {
      this.tickerAlert = false;
      return this.tickerDefault;
    }

    this.tickerNr += 1;
    if (this.tickerNr >= this.tickerList.length) {
      this.tickerNr = 0;
    }

    this.tickerAlert = true;
    return this.tickerList[this.tickerNr];
  }

  update(): void {
    const content = this.config.getContent();
    this.tickerList = content.ticker;
    this.tickerDefault = content.ticker_default;

    if (this.tickerList == null) {
      this.tickerList = [];
    }

    const now = Date.now();

    if (now - this.lastTickerTime > 1000 * this.config.getTickerDisplayDuration()) {
      this.lastTickerTime = now;
      this.ticker = this.nextTickerMsg();
    }

    this.setImageSize();
  }


}
