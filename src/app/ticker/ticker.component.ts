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
  private  tickerDefault = '';
  private tickerNr = 0;

  public ticker = '';
  public tickerAlert = false;

  private timer: Observable<number>;


  constructor(public config: ConfigService) {
    this.setUpdateTimer(5);
  }

  ngOnInit(): void {
  }

  setUpdateTimer(secs: number) {
    this.timer = timer(secs * 1000);
    this.timer.subscribe((t) => { this.update(); });
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

    this.ticker = this.nextTickerMsg();
    this.setUpdateTimer(this.config.getTickerDisplayDuration());
  }
}
