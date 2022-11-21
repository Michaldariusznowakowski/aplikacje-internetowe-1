class Geo {
  constructor(cMap,cMain) {
    this.cMain=cMain;
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
    this.cMain.buttonDisable(this.cMain.btnRaster,false);
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
  constructor(cMain) {
    this.cMain=cMain;
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
    let tiles=[];
    for (let j = hs; j <= h; j=j+hs){
      for (let i = ws; i <= w; i=i+ws) {
        let newCan=this.cropTile(docCanvas,lastw,lasth,i,j);
        newCan.setAttribute("id","puzzle-"+id);
        newCan.setAttribute("draggable","true");
        newCan.addEventListener("dragover",this.allowDrop.bind(this));
        newCan.addEventListener("dragstart",this.drag.bind(this));
        newCan.addEventListener("drop",this.drop.bind(this));
        id++;
        tiles.push(newCan);
        lastw=i;
      }
      lastw=0;
      lasth=j;
      let shuffledTiles=tiles.sort((a,b)=>0.5-Math.random());
      for (let index = 0; index < shuffledTiles.length; index++) {
        newDiv.appendChild(shuffledTiles[index]);
        
      }
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
  checkIfWin(){
    let list=document.querySelector(".mapRast div").childNodes;
    let dragindex=0;
      for(let i=0;i<list.length;i++){
        if(list[i].id!="puzzle-"+i){
          return;
      }
    }
    console.log("Victory!")
    this.cMain.victory();
  }
   drop(e){
    e.preventDefault();
    let parent=document.querySelector(".mapRast div");
    
    let data=e.dataTransfer.getData("text");
    //copy canvas

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
    let list=document.querySelector(".mapRast div").childNodes;
    let dragindex=0;
    for(let i=0;i<list.length;i++){
      if(list[i].id===data){
        dragindex=i;
    }
    }
    //replace 
    document.querySelector(".mapRast div").replaceChild(document.querySelector("#"+data),e.target);
    //restore old
    document.querySelector(".mapRast div").insertBefore(clone,parent.childNodes[dragindex]);
    this.checkIfWin();
    }
    }
  }

class Main {
  constructor() {
    this.btnGeolocal = document.getElementById("btnGeolocal");
    this.btnRaster = document.getElementById("btnRaster");
    this.btnPuzzle = document.getElementById("btnPuzzle");
    this.btnReset = document.getElementById("btnReset");
    this.buttonDisable(this.btnRaster,true);
    this.buttonDisable(this.btnPuzzle,true);
    this.buttonDisable(this.btnReset,true);
    

    this.cNotify = new Notify();
    this.cMap = new Map(this);
    this.cGeo = new Geo(this.cMap,this);
    this.lol="LOL"

    this.createEvents();
  }
  createEvents() {
    this.btnGeolocal.addEventListener("click",this.geolocal.bind(this));
    this.btnRaster.addEventListener("click",this.raster.bind(this));
    this.btnPuzzle.addEventListener("click",this.puzzle.bind(this));
    this.btnReset.addEventListener("click",this.reset.bind(this));
  }
  mapDisable(bool){
    map=this.cMap.map;
    if(bool){
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) map.tap.disable();
      document.getElementById('map').style.cursor='default';
    }else{
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if (map.tap) map.tap.enable();
      document.getElementById('map').style.cursor='grab';
    }
  }
  victory(){
    this.clearRightPanel();
    this.raster();
    this.cNotify.sendNotification("Congratulations! You win!");
  }
  geolocal() {
    this.cGeo.request();
    if(this.cGeo.getErr()==1){
      this.cNotify.sendNotification("Please allow geolocalization!");
    }
    if(this.cGeo.getErr()==0){
      this.buttonDisable(this.btnRaster,false);
      this.cNotify.sendNotification("Please wait... Getting your localization!");
    }
  }
  raster(){
    this.cMap.drawMap();
    this.mapDisable(true);
    this.buttonDisable(this.btnRaster,true);
    this.buttonDisable(this.btnPuzzle,false);
    this.buttonDisable(this.btnReset,false);
  }
  puzzle(){
    start.cMap.splitMap();
    this.buttonDisable(this.btnRaster,true);
    this.buttonDisable(this.btnPuzzle,true);
    this.buttonDisable(this.btnReset,false);
  }
  buttonDisable(btn,bool){
    btn.disabled=bool;
  }
  clearRightPanel(){
    let parent=document.querySelector(".mapRast");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
  }
  reset(){
    this.mapDisable(false);
    this.clearRightPanel();
    this.buttonDisable(this.btnRaster,false);
    this.buttonDisable(this.btnPuzzle,true);
    this.buttonDisable(this.btnReset,true);
  }

}

start = new Main();