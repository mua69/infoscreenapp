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

  public forecastContent = [];

  private timerWeather: Observable<number>;
  private timerForecast: Observable<number>;
  private timerUpdate: Observable<number>;

  private weather : any;
  private forecast : any;

  private iconMap;

  constructor(private config: ConfigService, private http: HttpClient) {
    this.timerWeather = timer(5*1000, 600*1000);
    this.timerForecast = timer(5*1000, 3600*1000);
    this.timerUpdate = timer(10*1000, 60*1000);

    this.timerWeather.subscribe((t) => {
      this.updateWeather();
    });

    this.timerForecast.subscribe((t) => {
      this.updateForecast();
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

    var i;
    for (i = 0; i < 4; i++) {
      this.forecastContent.push({'time':'00:00', 'temp':'--', 'icon':'assets/weather/18.png'});
    }
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

  updateForecast() {
    var url = this.buildForecastUrl();

    if (url != '') {
      this.http.get(url).subscribe((data: any) => { this.forecast = data; } );
    }
  }

  getWeatherIcon(iconId) {

    var icon = this.iconMap.get(iconId);

    if (!icon) {
      return 'assets/weather/18.png';
    }

    return 'assets/weather/' +  this.iconMap.get(iconId);
  }

  convertTemp(temp) {
    temp  = temp - 273.15;
    var s = temp.toFixed(0).toString();
    if (s === '-0') {
      return '0';
    } else {
      return s;
    }
  }

  padzero(v: number): string {
    var res = '';

    if ( v < 10) {
      res = '0';
    }

    res += v;

    return res;
  }

  updateData() : void {
    if (this.weather) {
      this.temperature = this.convertTemp(this.weather.main.temp);

      var condition = this.weather.weather[0];
      this.currentConditionIcon = this.getWeatherIcon(condition.icon);
    }

    if (this.forecast) {
      var i;
      for (i = 1; i <=4; i++) {
	var fc = this.forecast.list[i];

	if (fc) {
	  var date = new Date(fc.dt * 1000);

	  this.forecastContent[i-1].time = this.padzero(date.getUTCHours()) + ":00";

	  this.forecastContent[i-1].temp = this.convertTemp(fc.main.temp);
	  this.forecastContent[i-1].icon = this.getWeatherIcon(fc.weather[0].icon);

	} else {
	  this.forecastContent[i-1].time = '00:00';
	  this.forecastContent[i-1].temp = '--';
	  this.forecastContent[i-1].icon = 'assets/weather/18.png';
	}

      }

    }
  }

}
