import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  fetchWeather(data: any) {
    return this.http.get(environment.apiURL + 'q=' + data + '&appid=' + environment.appID);
  }

  fetchCoordinatesWeather(lat: any, long: any) {
    return this.http.get(environment.apiURL + 'lat=' + lat + '&lon=' + long + '&appid=' + environment.appID);
  }
}
