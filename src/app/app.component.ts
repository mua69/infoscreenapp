import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'infoscreen';

  public imgWidth = 100;
  public imgHeight = 100;

  constructor( public config: ConfigService) {
    config.configLoaded$.subscribe( dummy => {this.setImageSize(); });
  }

  ngOnInit(): void {
  }

  onResize(event) {
    this.setImageSize();
  }

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
}
