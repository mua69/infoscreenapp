import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { ConfigService } from './config.service';
import { WeatherComponent } from './weather/weather.component';
import { ContentComponent } from './content/content.component';
import { TickerComponent } from './ticker/ticker.component';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    WeatherComponent,
    ContentComponent,
    TickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ ConfigService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
