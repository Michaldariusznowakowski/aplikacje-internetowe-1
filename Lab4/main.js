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
      docDivMapRast.appendChild(canvas);
    });
  }
  cropTile(can, ax,ay,bx,by) {
    let canv = can.getContext('2d');
    console.log("ax "+ax+"ay "+ay+"bx "+bx+"by "+by);
    let iD = canv.getImageData(ax, ay, bx, by);
    let newCan = document.createElement('canvas');
    newCan.width = bx - ax;
    newCan.height = by - ay;
    let newC = newCan.getContext('2d');
    newC.putImageData(iD, 0, 0);
    return newCan;    
 }
  splitMap(){
    let docDivMapRast = document.querySelector(".mapRast");
    let docCanvas = docDivMapRast.querySelector("canvas");
    let w=docCanvas.width;
    let h=docCanvas.height;
    let ws=Math.floor(w/4);
    let hs=Math.floor(h/4);
    let newDiv=document.createElement("div");
    let lastw=0;
    let lasth=0;
    
    let id=0;
    for (let j = hs; j <= h; j=j+hs){
      for (let i = ws; i <= w; i=i+ws) {
        let newCan=this.cropTile(docCanvas,lastw,lasth,i,j);
        newCan.setAttribute("id","puzzle-"+id);
        newCan.setAttribute("draggable","true");
        newCan.addEventListener("dragover",this.allowDrop.bind(this));
        newCan.addEventListener("dragstart",this.drag.bind(this));
        newCan.addEventListener("drop",this.drop.bind(this));
        id++;
        newDiv.appendChild(newCan);
        lastw=i;
      }
      lastw=0;
      lasth=j;
      
    }
    docDivMapRast.appendChild(newDiv);
    docCanvas.remove();
  }
  drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);

  }
  allowDrop(ev){
    ev.preventDefault();
    
  }
   drop(e){
    e.preventDefault();
    let parent=document.querySelector(".mapRast div");
    
    let data=e.dataTransfer.getData("text");
    //copy canvas
    console.log(e.target);
    console.log(data);

    let clone = document.createElement("canvas");
    let context = clone.getContext("2d");
    clone.width = e.target.width;
    clone.height = e.target.height;
    context.drawImage(e.target, 0, 0);
    clone.setAttribute("id",e.target.id);
    clone.setAttribute("draggable","true");
    clone.addEventListener("dragover",this.allowDrop.bind(this));
    clone.addEventListener("dragstart",this.drag.bind(this));
    clone.addEventListener("drop",this.drop.bind(this));
    

    if(clone.id !== data) { // nie można na siebie!
    let nodelist=document.querySelector(".mapRast div").childNodes;
    let dragindex=0;
    for(let i=0;i<nodelist.length;i++){
      if(nodelist[i].id===data){
        dragindex=i;
        console.log(dragindex);
    }
    }
    //replace 
    document.querySelector(".mapRast div").replaceChild(document.querySelector("#"+data),e.target);
    //restore old
    document.querySelector(".mapRast div").insertBefore(clone,parent.childNodes[dragindex]);
    }
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
    this.docPuzzle.addEventListener("click",this.puzzle.bind(this));
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
  puzzle(){
    start.cMap.splitMap();
  }

}

start = new Main();