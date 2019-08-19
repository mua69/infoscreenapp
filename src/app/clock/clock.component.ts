import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})

export class ClockComponent implements OnInit {

  private timer: Observable<number>;
  public timestr = '';
  public datestr1 = '';
  public datestr2 = '';

  private weekdays = [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  constructor() {

    // Periodically update the information displayed on the page
    this.timer = interval(10*1000);
    this.timer.subscribe((t) => {
      this.update();
    });

 }

  ngOnInit() {
    this.update();
  }

  padzero(v: number): string {
    var res = '';

    if ( v < 10) {
      res = '0';
    }

    res += v;

    return res;
  }

  update(): void {
    var now = new Date();
    
    this.timestr = this.padzero(now.getHours()) + ':' + this.padzero(now.getMinutes());

    this.datestr1 = this.weekdays[now.getDay()] + ',';

    this.datestr2 = this.padzero(now.getDate()) + '.' + this.padzero(now.getMonth()+1) + '.' + now.getFullYear();
    
  }
}
