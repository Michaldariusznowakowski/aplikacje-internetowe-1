class Geo {
  constructor(cMap) {
    this.cMap=cMap;
    this.options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), this.options);
    this.err=0;
  }
  getErr(){
    return this.err;
  }
  success(pos) {
    console.log("Geo:SUCCES");
    this.cMap.setPos(pos.coords);
    this.err=0;
  }
  error(err) {
    this.err=1;
    console.warn(`Geo:ERROR(${err.code}): ${err.message}`);
  }
  request() {
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), this.options);
    }
}

class Notify {
  constructor() {
    Notification.requestPermission();
  }
  sendNotification(text) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification!");
    } else if (Notification.permission === "granted") {
      new Notification(text);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
      alert(text);
    }
  }
}

class Map {
  constructor() {
    this.map = L.map('map');
    this.tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      renderer: L.svg(),
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }
  setPos(crd, zoom = 13) {
    this.map.setView([crd.latitude, crd.longitude], zoom);
    this.marker = L.marker([crd.latitude, crd.longitude]).addTo(this.map);
  }
  drawMap() {
    var map=this.map
    leafletImage(this.map, function (err, canvas) {
      let docDivMapRast = document.querySelector(".mapRast");
      let docCanvas = document.querySelector("#rasterMap");
      docDivMapRast.appendChild(canvas);
    });
  }
}

class Main {
  constructor() {
    this.docGeolocal = document.getElementById("geolocal");
    this.docRaster = document.getElementById("raster");
    this.docPuzzle = document.getElementById("puzzle");

    

    this.cNotify = new Notify();
    this.cMap = new Map();
    this.cGeo = new Geo(this.cMap);
    this.lol="LOL"

    this.createEvents();
  }
  createEvents() {
    this.docGeolocal.addEventListener("click",this.geolocal.bind(this));
    this.docRaster.addEventListener("click",this.raster.bind(this));
    //this.docPuzzle.onclick = this.puzzle();
  }
  geolocal() {
    this.cGeo.request();
    if(this.cGeo.getErr()==1){
      this.cNotify.sendNotification("Please allow geolocalization!");
    }
    if(this.cGeo.getErr()==0){
      this.cNotify.sendNotification("Please wait... Getting your localization!");
    }
  }
  raster(){
    this.cMap.drawMap();
  }

}

start = new Main();