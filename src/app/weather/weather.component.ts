import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit {

  public temperature = '--';
  public currentConditionIcon = 'assets/weather/18.png';

  private timerWeather: Observable<number>;
  private timerForecast: Observable<number>;
  private timerUpdate: Observable<number>;

  private weather : any;

  private iconMap;

  constructor(private config: ConfigService, private http: HttpClient) {
    this.timerWeather = timer(5*1000, 600*1000);
    this.timerForecast = timer(5*1000, 3600*1000);
    this.timerUpdate = timer(7*1000, 60*1000);

    this.timerWeather.subscribe((t) => {
      this.updateWeather();
    });

    this.timerUpdate.subscribe( (t) => {this.updateData();} );

    this.iconMap = new Map([ [ '01d', '0-8.png'],
			     [ '01n', '0-8n.png'],
			     [ '02d', '2-8.png'],
			     [ '02n', '2-8n.png'],
			     [ '03d', '5-8.png'],
			     [ '03n', '5-8n.png'],
			     [ '04d', '8-8.png'],
			     [ '04n', '8-8.png'],
			     [ '09d', '9.png'],
			     [ '09n', '9.png'],
			     [ '10d', '80.png'],
			     [ '10n', '80n.png'],
			     [ '11d', '27.png'],
			     [ '11n', '27.png'],
			     [ '13d', '67.png'],
			     [ '13n', '67.png'],
			     [ '50d', '40.png'],
			     [ '50n', '40.png'],
			     ]);
    
  }

  ngOnInit() {
  }

  getBaseUrl() {
    var url = this.config.getOpenWeatherMapUrl();

    if (url == '') {
      return '';
    }

    if (url.substr(-1) != '/') {
      url += '/';
    }

    return url;
  }

  buildWeatherUrl() {
    var url = this.getBaseUrl();

    if (url != '') {
      url += 'weather?';

      var id = this.config.getOpenWeatherMapCityId();
      url += 'id=' + id;
      
      var apiKey = this.config.getOpenWeatherMapApiKey();
      url += '&appid=' + apiKey;

      return url;
    }

    return '';
  }

  buildForecastUrl() {
    var url = this.getBaseUrl();

    if (url != '') {
      url += 'forecast?';

      var id = this.config.getOpenWeatherMapCityId();
      url += 'id=' + id;
      
      var apiKey = this.config.getOpenWeatherMapApiKey();
      url += '&appid=' + apiKey;

      return url;
    }

    return '';
  }

  updateWeather() {
    var url = this.buildWeatherUrl();

    if (url != '') {
      this.http.get(url).subscribe((data: any) => { this.weather = data; } ); 
    }
  }

  getWeatherIcon(iconId) {
    var icon = 'assets/weather/' +  this.iconMap.get(iconId);

    if (!icon) {
      return 'assets/weather/18.png';
    }

    return icon;
  }

  updateData() : void {
    if (this.weather) {
      var temp = this.weather.main.temp - 273.15;
      this.temperature = temp.toFixed(0).toString();

      var condition = this.weather.weather[0];
      this.currentConditionIcon = this.getWeatherIcon(condition.icon);
    }
  }

}
