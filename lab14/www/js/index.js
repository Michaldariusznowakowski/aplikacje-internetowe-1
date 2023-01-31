"use strict";
class Weather {
  constructor(apiKey, searchInput, searchButton, wrapperWeather) {
    this.apiKey = apiKey;
    this.searchInput = document.querySelector(searchInput);
    this.searchButton = document.querySelector(searchButton);
    this.wrapperWeather = document.querySelector(wrapperWeather);

    this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl".replace("{apiKey}", this.apiKey);;
    this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl".replace("{apiKey}", this.apiKey);;
    this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

    this.today = this.wrapperWeather.querySelector(".today");
    this.nextdays = this.wrapperWeather.querySelector(".nextdays");
    this.addEvent();
  }
  clearDiv(doc) {
    let parent = doc;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  addEvent() {
    this.searchButton.addEventListener("click", this.search.bind(this));
  }
  search() {
    let input = this.searchInput.value.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "");
    input = encodeURIComponent(input.trim());
    if (input != "" && input.length > 2) {

      this.getCurrentWeather(input);
      this.getForecast(input);
    }

  }
  getCurrentWeather(city) {
    let url = this.currentWeatherLink.replace("{query}", city)
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", () => {
      this.clearDiv(this.today);
      let response = JSON.parse(req.responseText);
      console.log(response);
      let date = new Date(response.dt * 1000);
      this.createWeatherBlock(date.toLocaleDateString("pl-PL"), date.toLocaleTimeString("pl-PL"), response.main.temp, response.main.feels_like, response.weather[0].icon, response.weather[0].description, this.today);
    });
    req.send();

  }
  createWeatherBlock(indate, intime, intemp, intempFeels, iniconSrc, indesc, intarget) {
    let wBlock = document.createElement("div");
    let wDesc = document.createElement("div");
    let wIcon = document.createElement("img");
    let wTempFeels = document.createElement("div");
    let wTemp = document.createElement("div");
    let wTime = document.createElement("div");
    let wDate = document.createElement("div");

    wBlock.className = "wBlock";
    wDate.className = "wDate";
    wTime.className = "wTime";
    wTemp.className = "wTemp";
    wTempFeels.className = "wTempFeels";
    wIcon.className = "wIcon";
    wDesc.className = "wDesc";


    wTime.innerText = intime;
    wDate.innerText = indate;
    wTemp.innerText = intemp;
    wTempFeels.innerText = intempFeels;
    wIcon.src = this.iconLink.replace("{iconName}", iniconSrc);
    wDesc.innerText = indesc;

    wBlock.appendChild(wDate);
    wBlock.appendChild(wTime);
    wBlock.appendChild(wTemp);
    wBlock.appendChild(wTempFeels);
    wBlock.appendChild(wIcon);
    wBlock.appendChild(wDesc);

    intarget.appendChild(wBlock);
  }
  getForecast(city) {
    let url = this.forecastLink.replace("{query}", city);
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      this.clearDiv(this.nextdays);

      console.log(data);
      let day = "";
      let group = document.createElement("div");
      group.className = "group";
      let forecast = data.list;
      for (let index = 0; index < forecast.length; index++) {
        let w = forecast[index];
        let date = new Date(w.dt * 1000);
        if (date.toLocaleDateString("pl-PL") != day && index > 0) {
          this.nextdays.appendChild(group);
          group = document.createElement("div");
          group.className = "group";
        }
        this.createWeatherBlock(date.toLocaleDateString("pl-PL"), date.toLocaleTimeString("pl-PL"), w.main.temp, w.main.feels_like, w.weather[0].icon, w.weather[0].description, group);

        if (index == forecast.length - 1) {
          this.nextdays.appendChild(group);
        }
        day = date.toLocaleDateString("pl-PL");

      }
    });
  }

}

let w = new Weather("6ec5e511ce31d9e5193a2bd7f0bf716d", "#searchInput", "#searchButton", ".wrapperWeather");
w.getCurrentWeather("Szczecin, Poland");
w.getForecast("Szczecin, Poland");