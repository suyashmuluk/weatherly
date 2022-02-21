import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  city_form: FormGroup;
  error_text = '';
  weather_data_block = false;
  weather_data: any = {};
  weather_desc = "";
  close_icon = false;
  dark_theme: boolean;
  @ViewChildren('theme_changed') theme_changed!: QueryList<any>;

  constructor(private weather: WeatherService,
    private formBuilder: FormBuilder,
    @Inject('COUNTRIES') public country: any[]) {
    this.getCurrentCity();
    setTimeout(() => {
      this.checkTheme();
    }, 1000);
  }

  ngOnInit(): void {
    this.city_form = this.formBuilder.group({
      city: ['', Validators.required]
    });
  }

  get formControls() {
    return this.city_form.controls;
  }

  checkTheme() {
    if (JSON.parse(localStorage.getItem('dark_theme'))) {
      this.dark_theme = true;
      let parent = document.getElementById('parent_element');
      parent.classList.add('dark_theme_text');
      this.theme_changed.toArray().forEach(el => {
        el.nativeElement.classList.add('dark_theme')
      });
    } else {
      this.dark_theme = false;
    }
  }

  getCurrentCity() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        this.weather.fetchCoordinatesWeather(lat, lon).subscribe(data => {
          this.weather_data = data;
          if (Object.keys(this.weather_data).length > 1) {
            this.weather_data_block = true;
            this.city_form.reset();
            this.setImages(this.weather_data);
            this.setBgImg(this.weather_data);
          }
        })
      }, error => {
        console.log("Error in fetching latitude and longitude");
      });
    } else {
      return false;
    }
  }

  getCityWeather() {
    if (this.city_form.invalid) {
      this.error_text = 'Please fill city name';
      this.weather_data_block = false;
      return;
    } else {
      this.error_text = '';
      this.weather.fetchWeather(this.city_form.value.city).subscribe((data) => {
        this.weather_data = data;
        if (Object.keys(this.weather_data).length > 1) {
          this.weather_data_block = true;
          this.city_form.reset();
          this.setImages(this.weather_data);
          this.setBgImg(this.weather_data);
        }
      }, error => {
        this.error_text = error.error.message;
      });
    }
  }

  convertTemp(data) {
    if (data['main']) {
      return Math.round((data['main']['temp'] - 273.15));
    }
  }

  getCountry(data) {
    if (data['sys'])
      return this.country.find(x => x.code === data['sys']['country']).name;
  }

  getDayTime(data, value) {
    if (data['sys']) {
      return (new Date(data['sys'][value] * 1000).toLocaleTimeString());
    }
  }

  setBgImg(data) {
    if (data['weather']) {
      if (data['weather'][0]['main'] === 'Clouds') {
        return '../../assets/cloudy.jpg';
      } else if (data['weather'][0]['main'] === 'Haze') {
        return '../../assets/haze.jpg';
      } else if (data['weather'][0]['main'] === 'Clear') {
        return '../../assets/clear.jpg';
      } else if (data['weather'][0]['main'] === 'Mist') {
        return '../../assets/mist.jpg';
      } else if (data['weather'][0]['main'] === 'Rain') {
        return '../../assets/rain.jpg';
      } else if (data['weather'][0]['main'] === 'Fog') {
        return '../../assets/fog.jpg';
      } else if (data['weather'][0]['main'] === 'Thunderstorm') {
        return '../../assets/thunder.jpg';
      } else if (data['weather'][0]['main'] === 'Smoke') {
        return '../../assets/smoky.jpg';
      } else if (data['weather'][0]['main'] === 'Snow') {
        return '../../assets/snow.jpg';
      }
    }
  }

  setImages(data) {
    if (data['weather']) {
      if (data['weather'][0]['main'] === 'Clouds') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/external-prettycons-flat-prettycons/94/000000/external-cloudy-weather-prettycons-flat-prettycons.png';
      } else if (data['weather'][0]['main'] === 'Haze') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/color/96/000000/fog-day--v1.png';
      } else if (data['weather'][0]['main'] === 'Clear') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/clouds/100/000000/sky.png'
      } else if (data['weather'][0]['main'] === 'Rain') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/color/96/000000/rain--v1.png'
      } else if (data['weather'][0]['main'] === 'Mist') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/96/000000/external-mist-natural-disaster-photo3ideastudio-flat-photo3ideastudio.png'
      } else if (data['weather'][0]['main'] === 'Fog') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/emoji/48/000000/fog.png'
      } else if (data['weather'][0]['main'] === 'Thunderstorm') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/external-justicon-flat-justicon/94/000000/external-thunderstorm-weather-justicon-flat-justicon.png';
      } else if (data['weather'][0]['main'] === 'Smoke') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/external-tulpahn-flat-tulpahn/64/000000/external-foggy-weather-tulpahn-flat-tulpahn.png'
      } else if (data['weather'][0]['main'] === 'Snow') {
        this.weather_desc = data['weather'][0]['description'];
        return 'https://img.icons8.com/external-konkapp-flat-konkapp/64/000000/external-snow-natural-disaster-konkapp-flat-konkapp-1.png'
      }
    }
  }

  getWind(data, value) {
    if (data['wind'])
      return data['wind'][value];
  }

  getCoords(data, value) {
    if (data['coord']) {
      return data['coord'][value];
    }
  }

  getCurrentTime(data) {
    if (data) {
      return (new Date(data['dt'] * 1000)).toLocaleString();
    }
  }

  getOtherDetails(data, value) {
    if (data['main'] && value !== 'visibility') {
      if (value === 'feels_like') {
        return Math.round((data['main'][value] - 273.15));
      } else {
        return data['main'][value];
      }
    } else if (value === 'visibility') {
      switch (true) {
        case data['visibility'] < 1000:
          return 'Low';
        case data['visibility'] >= 1000 && data['visibility'] < 5000:
          return 'Medium';
        case data['visibility'] >= 5000:
          return 'High';
      }
    }
  }

  toggleSidebar() {
    let sidebar = document.getElementById('sidebar');
    let menu = document.getElementById('menu');
    sidebar.classList.toggle('open_sidebar');

    if (sidebar.classList.contains('open_sidebar')) {
      menu.classList.add('menu_position');
      this.close_icon = true;
    } else {
      menu.classList.remove('menu_position');
      this.close_icon = false;
    }
  }

  toggleTheme(event?) {
    let parent = document.getElementById('parent_element');
    if ((event && event.target.checked)) {
      this.dark_theme = true;
      parent.classList.add('dark_theme_text');
      this.theme_changed.toArray().forEach(el => {
        el.nativeElement.classList.add('dark_theme')
      });
      localStorage.setItem('dark_theme', JSON.stringify(this.dark_theme));
    } else {
      this.dark_theme = false;
      parent.classList.remove('dark_theme_text');

      this.theme_changed.toArray().forEach(el => {
        el.nativeElement.classList.remove('dark_theme')
      });
      localStorage.removeItem('dark_theme');
    }
  }

}
