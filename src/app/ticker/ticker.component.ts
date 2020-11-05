import { Component, OnInit } from '@angular/core';
import {Observable, timer} from 'rxjs';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  private tickerList = [];
  private tickerDefault = '';
  private tickerNr = -1;

  public ticker = '';
  public tickerAlert = false;

  private emptyTicker = { type: 't',  text: ' '};

  private timer: Observable<number>;

  constructor(public config: ConfigService) {
    this.setUpdateTimer(2);
    this.config.contentLoaded$.subscribe(content => { this.getContent(content); });
  }

  ngOnInit(): void {
  }

  setUpdateTimer(secs: number) {
    this.timer = timer(secs * 1000);
    this.timer.subscribe((t) => { this.update(); });
  }

  getMsg(content: any) {
    if (content.type === 't') {
      return content.text;
    }
    return ' ';
  }
  nextTickerMsg() {
    if (this.tickerList === null || this.tickerList.length === 0) {
      this.tickerAlert = false;
      return this.getMsg(this.tickerDefault);
    }

    this.tickerNr += 1;
    if (this.tickerNr >= this.tickerList.length) {
      this.tickerNr = 0;
    }

    this.tickerAlert = true;
    return this.getMsg(this.tickerList[this.tickerNr]);
  }

  getContent(content: any): void {
    this.tickerList = content.ticker;
    this.tickerDefault = content.ticker_default;
    this.tickerNr = -1;
  }

  update(): void {
    this.ticker = this.nextTickerMsg();
    this.setUpdateTimer(this.config.getTickerDisplayDuration());
  }
}
