/* mapapp.js — unified map for SKM "near me" sites.
   All-city data · numbered clusters · rich popups · place/pincode/DIGIPIN search
   · origin-based on-page routing (place / DIGIPIN / lat,lon / pincode / my location).
   Runs on home+city pages (window.CFG) and keyword-page embeds (window.KWMAP_CFG). */
(function(){
"use strict";
var C = window.CFG;
var EMBED = false;
if (!C) { C = window.KWMAP_CFG; EMBED = true; if (!C) return; }
var ac = C.ac || "#0d9488";
var mapEl = EMBED ? document.getElementById("kwmap") : document.getElementById("map");
if (!mapEl) return;

/* ===== BLOCK:JS-CLUSTER-CSS ===== */
if (!document.getElementById("mc-css")) {
  [["mc-css","https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"],
   ["mc-css2","https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"]]
  .forEach(function(p){
    var l=document.createElement("link"); l.id=p[0]; l.rel="stylesheet"; l.href=p[1];
    document.head.appendChild(l);
  });
}

/* ===== BLOCK:JS-DIGIPIN ===== */
var GRID=[["F","C","9","8"],["J","3","2","7"],["K","4","5","6"],["L","M","P","T"]];
var B={minLat:2.5,maxLat:38.5,minLon:63.5,maxLon:99.5};
function getDigiPin(lat,lon){
  if(lat<B.minLat||lat>B.maxLat||lon<B.minLon||lon>B.maxLon)return null;
  var mnLt=B.minLat,mxLt=B.maxLat,mnLn=B.minLon,mxLn=B.maxLon,pin="";
  for(var i=0;i<10;i++){
    var ld=(mxLt-mnLt)/4,nd=(mxLn-mnLn)/4;
    var row=3-Math.floor((lat-mnLt)/ld),col=Math.floor((lon-mnLn)/nd);
    row=Math.max(0,Math.min(row,3));col=Math.max(0,Math.min(col,3));
    pin+=GRID[row][col];
    mxLt=mnLt+ld*(4-row);mnLt=mnLt+ld*(3-row);mnLn=mnLn+nd*col;mxLn=mnLn+nd*(col+1);
  }
  return pin.toUpperCase();
}
function fromDigiPin(pin){
  pin=(pin||"").toUpperCase().replace(/[^FC98J327K456LMPT]/g,"");
  if(pin.length!==10)return null;
  var mnLt=B.minLat,mxLt=B.maxLat,mnLn=B.minLon,mxLn=B.maxLon;
  for(var i=0;i<10;i++){
    var ld=(mxLt-mnLt)/4,nd=(mxLn-mnLn)/4,r=-1,c=-1;
    for(var y=0;y<4;y++)for(var x=0;x<4;x++)if(GRID[y][x]===pin[i]){r=y;c=x;}
    if(r<0)return null;
    mxLt=mnLt+ld*(4-r);mnLt=mnLt+ld*(3-r);mnLn=mnLn+nd*c;mxLn=mnLn+nd*(c+1);
  }
  return {lat:+((mnLt+mxLt)/2).toFixed(6),lon:+((mnLn+mxLn)/2).toFixed(6)};
}

/* ===== BLOCK:JS-STATE ===== */
var L_=window.L,map,cluster=null,routeL=null,all=[],flts={},q="",dest=null,TF={};
var searchMk=null,routeinfo=null,resultsEl=null,geoTimer=null;
(C.filters||[]).forEach(function(f){TF[f.k]=new Function("p","return ("+f.t+")");});
var count=document.getElementById(EMBED?"kwcount":"count");
var toastEl=document.getElementById("toast");
function toast(m){
  if(!toastEl){if(count)count.textContent=m;return;}
  toastEl.textContent=m;toastEl.classList.add("show");
  setTimeout(function(){toastEl.classList.remove("show");},2000);
}
window.copyT=function(t){if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){toast("Copied \u2713");});};

/* ===== BLOCK:JS-CLUSTER-PLUGIN =====
   Load the leaflet.markercluster JS (only the CSS was loaded before -> L.markerClusterGroup
   was undefined -> pins never rendered). If the plugin fails/blocked, mkCluster() falls back
   to a plain layerGroup, so the map ALWAYS shows pins. */
function mcReady(){return !!(window.L&&window.L.markerClusterGroup);}
if(!mcReady()){
  (function(){
    var s=document.createElement("script");
    s.src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
    s.async=true;
    s.onload=function(){try{if(typeof render==="function"&&all.length)render();}catch(e){}};
    document.head.appendChild(s);
  })();
}

/* ===== BLOCK:JS-MAP-INIT ===== */
map=L_.map(mapEl);
if(C.startCity&&C.cities[C.startCity])map.setView([C.cities[C.startCity].lat,C.cities[C.startCity].lon],11);
else if(EMBED){var dk=C.def||Object.keys(C.cities)[0];map.setView([C.cities[dk].lat,C.cities[dk].lon],11);}
else map.setView([22.8,79],4);
/* ===== BLOCK:JS-MAP-THEME =====
   Real dark basemap (CartoDB dark) instead of an invert filter, plus an INDEPENDENT
   map light/dark control (site theme and map theme are separate). */
var TILES={
  light:{url:"https://tile.openstreetmap.org/{z}/{x}/{y}.png",max:19,
         attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'},
  dark:{url:"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",max:16,
        attr:'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'}
};
var tileL=null,mapThemeBtn=null;
function siteThemeNow(){
  var t=document.documentElement.getAttribute("data-theme")||"auto";
  if(t==="auto"){try{return matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){return "light"}}
  return t;
}
function mapThemePref(){try{var v=localStorage.getItem("maptheme");return (v==="light"||v==="dark")?v:"dark"}catch(e){return "dark"}}
function applyMapTheme(){
  var want=mapThemePref();
  var t=TILES[want]||TILES.light;
  if(tileL)map.removeLayer(tileL);
  var errs=0;
  tileL=L_.tileLayer(t.url,{maxZoom:t.max,attribution:t.attr});
  tileL.on("tileerror",function(){
    errs++;
    if(errs>=3&&want==="dark"){            /* dark provider down/key-gated -> fall back to normal OSM */
      try{localStorage.setItem("maptheme","light")}catch(e){}
      toast("Dark map unavailable \u2014 using normal map");
      applyMapTheme();
    }
  });
  tileL.addTo(map);
  if(mapThemeBtn)mapThemeBtn.textContent=(want==="dark"?"\u2600\ufe0f":"\ud83c\udf19");
}
function cycleMapTheme(){
  var nx=(mapThemePref()==="dark")?"light":"dark";
  try{localStorage.setItem("maptheme",nx)}catch(e){}
  applyMapTheme();
  toast("Map tiles: "+nx);
}
applyMapTheme();
function ICONFN(c){
  var n=c.getChildCount(),s=n<100?"small":(n<1000?"medium":"large");
  return L_.divIcon({html:'<div><span>'+n.toLocaleString("en-IN")+"</span></div>",
    className:"marker-cluster marker-cluster-"+s,iconSize:L_.point(40,40)});
}
function mkCluster(){
  if(!L_.markerClusterGroup)return L_.layerGroup();   /* graceful fallback: pins always render */
  return L_.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:55,spiderfyOnMaxZoom:true,iconCreateFunction:ICONFN});
}
cluster=mkCluster();

/* ===== BLOCK:JS-DATA-LOAD ===== */
function loadAll(){
  var keys=Object.keys(C.cities),done=0;
  keys.forEach(function(s){
    fetch("/data/"+s+".json").then(function(r){return r.json();}).then(function(g){
      (g.features||[]).forEach(function(f){f._city=s;all.push(f);});
    }).catch(function(){}).then(function(){
      done++;
      if(done===keys.length){
        if(count)count.textContent=all.length.toLocaleString("en-IN")+" "+C.poiname+"s across "+keys.length+" cities \u00b7 \u00a9 OpenStreetMap";
        var cc=document.getElementById("citycount");
        if(cc&&C.startCity){var cn=0;all.forEach(function(f){if(f._city===C.startCity)cn++;});cc.textContent=cn.toLocaleString("en-IN");}
        render();
      }
    });
  });
}

/* ===== BLOCK:JS-POPUP ===== */
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML;}
function pp(f){
  var p=f.properties||{},lat=f.geometry.coordinates[1],lon=f.geometry.coordinates[0];
  var title=p.name||p.operator||p.brand||C.poiname;
  var h='<div class="pp"><b>'+esc(title)+'</b>';
  (C.popup||[]).forEach(function(fld){
    if(!p[fld.k])return;
    var v=esc(p[fld.k]);
    if(fld.b)v=({yes:"\u2705 yes",no:"\u274c no",limited:"\ud83d\udfe1 limited"}[p[fld.k]]||v);
    h+='<div class="row">'+fld.l+": "+v+'</div>';
  });
  if(p.description)h+='<div class="row">\ud83d\udcd3 '+esc(p.description).slice(0,140)+'</div>';
  if(C.cities[f._city])h+='<div class="row">\ud83d\udccd <a href="/'+f._city+'/">'+esc(C.cities[f._city].name)+" guide</a></div>";
  var dp=getDigiPin(lat,lon);
  if(dp)h+='<div class="row">\ud83d\uded1 DIGIPIN <b>'+dp+"</b> <span class='cpl' onclick=\"copyT('"+dp+"')\">copy</span></div>";
  h+='<button class="dirb" onclick="MA.routeTo('+lat+','+lon+')">\ud83e\udded Route to this '+esc(C.poiname)+"</button></div>";
  return h;
}

/* ===== BLOCK:JS-RENDER ===== */
function render(){
  if(cluster)map.removeLayer(cluster);
  cluster=mkCluster();
  all.forEach(function(f){
    var p=f.properties||{};
    if(q&&JSON.stringify(p).toLowerCase().indexOf(q)<0)return;
    for(var k in flts)if(flts[k]&&!TF[k](p))return;
    var lat=f.geometry.coordinates[1],lon=f.geometry.coordinates[0];
    var m=L_.circleMarker([lat,lon],{radius:7,weight:1.5,color:"#0f172a",
      fillColor:p.fee==="no"?"#34d399":(p.fee==="yes"?"#f59e0b":ac),fillOpacity:.95});
    m.bindPopup(pp(f),{maxWidth:300});
    cluster.addLayer(m);
  });
  map.addLayer(cluster);
  updateCount();
}
function updateCount(){
  if(!count)return;
  var b=map.getBounds(),n=0;
  for(var i=0;i<all.length;i++){
    var la=all[i].geometry.coordinates[1],lo=all[i].geometry.coordinates[0];
    if(b.contains([la,lo]))n++;
  }
  count.textContent=n.toLocaleString("en-IN")+" "+C.poiname+"s in view \u00b7 total "+all.length.toLocaleString("en-IN")+" \u00b7 \u00a9 OpenStreetMap";
}
map.on("moveend zoomend",updateCount);

/* ===== BLOCK:JS-GEOCODING ===== */
function closeResults(){if(resultsEl){resultsEl.remove();resultsEl=null;}}
function showResults(list,cb,inp){
  closeResults();
  resultsEl=document.createElement("div");
  resultsEl.style.cssText="position:absolute;z-index:9999;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 10px 30px rgba(15,23,42,.18);max-height:250px;overflow:auto;min-width:260px;font-size:.85rem";
  list.forEach(function(it){
    var d=document.createElement("div");
    d.style.cssText="padding:9px 12px;cursor:pointer;border-bottom:1px solid #f1f5f9";
    d.textContent=it.label;
    d.onmouseover=function(){d.style.background="#f1f5f9";};
    d.onmouseout=function(){d.style.background="";};
    d.onclick=function(){cb(it);closeResults();};
    resultsEl.appendChild(d);
  });
  document.body.appendChild(resultsEl);
  var r=inp.getBoundingClientRect();
  resultsEl.style.left=r.left+"px";resultsEl.style.top=(r.bottom+6)+"px";
  resultsEl.style.width=Math.max(260,r.width)+"px";
}
function geocode(term,cb,isPostal){
  var u="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&"+(isPostal?("postalcode="+encodeURIComponent(term)):("q="+encodeURIComponent(term)));
  fetch(u,{headers:{Accept:"application/json"}}).then(function(r){return r.json();}).then(function(d){
    cb((d||[]).map(function(x){return{label:x.display_name,lat:+x.lat,lon:+x.lon};}));
  }).catch(function(){cb([]);});
}
function parseOrigin(v,cb){
  v=(v||"").trim();
  var m=v.match(/^(-?\d{1,2}\.\d+)[ ,]+(-?\d{1,3}\.\d+)$/);
  if(m)return cb({lat:+m[1],lon:+m[2],label:v});
  var d=v.replace(/\s/g,"");
  if(/^[FfCc98Jj327Kk456LlMmPpTt]{10}$/.test(d)){
    var g=fromDigiPin(d);
    if(g)return cb({lat:g.lat,lon:g.lon,label:"DIGIPIN "+d.toUpperCase()});
    return cb(null);
  }
  if(/^\d{6}$/.test(v))return geocode(v,function(r){cb(r[0]||null);},true);
  if(v.length<3)return cb(null);
  geocode(v,function(r){cb(r[0]||null);});
}

/* ===== BLOCK:JS-SEARCH ===== */
function resolveQuery(v,cb){
  v=(v||"").trim();
  var m=v.match(/^(-?\d{1,2}\.\d+)[ ,]+(-?\d{1,3}\.\d+)$/);
  if(m)return cb([{label:"\ud83d\udccd "+v,lat:+m[1],lon:+m[2]}]);
  var d=v.replace(/\s/g,"");
  if(/^[FfCc98Jj327Kk456LlMmPpTt]{10}$/.test(d)){
    var g=fromDigiPin(d);
    if(g)return cb([{label:"\ud83d\uded1 DIGIPIN "+d.toUpperCase()+" (4m precision)",lat:g.lat,lon:g.lon}]);
  }
  if(/^\d{6}$/.test(v))return geocode(v,cb,true);
  if(v.length>=3)return geocode(v,cb,false);
  cb([]);
}
function bindSearch(inp){
  inp.placeholder="Search any place, pincode, DIGIPIN or lat,lon\u2026";
  inp.setAttribute("autocomplete","off");
  inp.addEventListener("input",function(e){
    q=e.target.value.toLowerCase();render();
    clearTimeout(geoTimer);
    var v=e.target.value.trim();
    if(!v){closeResults();return;}
    geoTimer=setTimeout(function(){
      resolveQuery(v,function(list){
        if(!list.length)return;
        showResults(list,function(it){
          map.flyTo([it.lat,it.lon],Math.max(map.getZoom(),13),{duration:1});
          if(searchMk)map.removeLayer(searchMk);
          searchMk=L_.circleMarker([it.lat,it.lon],{radius:9,color:"#0f172a",weight:3,fillColor:ac,fillOpacity:1})
            .addTo(map).bindPopup("<b>"+esc(it.label)+"</b><br><span class='cpl' onclick='MA.clearPin()'>clear \u2715</span>").openPopup();
        },inp);
      });
    },550);
  });
  inp.addEventListener("keydown",function(e){
    if(e.key==="Enter"){
      clearTimeout(geoTimer);closeResults();
      resolveQuery(inp.value.trim(),function(list){
        if(!list.length){toast("Nothing found \u2014 try a place, pincode, DIGIPIN or lat,lon");return;}
        map.flyTo([list[0].lat,list[0].lon],Math.max(map.getZoom(),13),{duration:1});
      });
    }
  });
}
var qEl=document.getElementById(EMBED?"kwq":"q");
if(qEl)bindSearch(qEl);
window.MA={clearPin:function(){if(searchMk){map.removeLayer(searchMk);searchMk=null;}}};

/* ===== BLOCK:JS-ROUTE-COLOUR ===== */
var ROUTE_COLORS=[["#2563EB","Blue"],["#10B981","Green"],["#F59E0B","Amber"],["#DC2626","Red"],["#7C3AED","Violet"]];
function routeColor(){try{var c=localStorage.getItem("routecolor");if(c&&ROUTE_COLORS.some(function(x){return x[0]===c}))return c}catch(e){}return "#2563EB";}
function setRouteColor(c){try{localStorage.setItem("routecolor",c)}catch(e){}if(dest&&nav.from)drawRoute(nav.from[0],nav.from[1],true);}

/* ===== BLOCK:JS-ROUTING ===== */
var originWrap=document.createElement("div");
originWrap.style.cssText="display:none;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0 0";
originWrap.innerHTML='<input id="origin" placeholder="From: place name, DIGIPIN, lat,lon or pincode" '+
  'style="flex:1;min-width:220px;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-family:inherit;font-size:.9rem">'+
  '<button id="origingo" style="padding:10px 14px;border-radius:10px;border:none;background:'+ac+';color:#fff;font-weight:700;cursor:pointer;font-size:.85rem">\ud83e\udded Draw route</button>'+
  '<button id="originme" style="padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;font-weight:700;cursor:pointer;font-size:.85rem">\ud83d\udccd My location</button>'+
  '<span style="font-size:.72rem;color:#94a3b8">routes \u00b7 OSRM \u00b7 search \u00b7 Nominatim (OSM)</span>';
var mapbar=(EMBED?mapEl.parentNode:mapEl.parentNode.querySelector(".mapbar"))||mapEl.parentNode;
/* #map is a SIBLING of .mapbar, not a child -> insert into the common parent before the map.
   (Was mapbar.insertBefore(originWrap,mapEl) -> NotFoundError killed the whole script on map pages.) */
try{ mapEl.parentNode.insertBefore(originWrap,mapEl); }catch(e){ mapbar.appendChild(originWrap); }
routeinfo=document.getElementById("routeinfo");
if(!routeinfo){
  routeinfo=document.createElement("span");routeinfo.id="routeinfo";
  routeinfo.style.cssText="display:none;font-size:.85rem;font-weight:700;color:#0f172a;background:"+(C.acsoft||"#ccfbf1")+";border:1px solid "+ac+";padding:6px 12px;border-radius:8px";
  try{ originWrap.parentNode.insertBefore(routeinfo,originWrap); }
  catch(e){ originWrap.parentNode.appendChild(routeinfo); }
}
MA.routeTo=function(lat,lon){
  originWrap.style.display="flex";
  if(routeinfo){routeinfo.style.display="inline-block";routeinfo.textContent="Pick your starting point \u2193";}

  dest=[lat,lon];
  try{originWrap.scrollIntoView({behavior:"smooth",block:"nearest"});}catch(e){}
  toast("Enter your starting point below");
  document.getElementById("origin").focus();
};
function setRouteInfo(html){if(routeinfo){routeinfo.style.display="inline-block";routeinfo.innerHTML=html;}}
function drawRoute(fLat,fLon,quiet){
  if(!dest){toast("Tap a "+C.poiname+" pin first");return;}
  if(!quiet)toast("Finding route\u2026");
  fetch("https://router.project-osrm.org/route/v1/driving/"+fLon+","+fLat+";"+dest[1]+","+dest[0]+"?overview=full&geometries=geojson")
   .then(function(r){return r.json();}).then(function(d){
     if(routeL)map.removeLayer(routeL);
     if(!d.routes||!d.routes[0]){drawLine(fLat,fLon);return;}
     var hadGeom=!!nav.geom;
     var rc=routeColor();
     routeL=L_.layerGroup().addTo(map);
     L_.geoJSON(d.routes[0].geometry,{style:{color:"#ffffff",weight:10,opacity:.85,lineCap:"round"}}).addTo(routeL);
     L_.geoJSON(d.routes[0].geometry,{style:{color:rc,weight:5.5,opacity:.95,lineCap:"round"}}).addTo(routeL);
     if(!quiet||!nav.active||!hadGeom)map.fitBounds(routeL.getBounds(),{padding:[30,30]});
     nav.geom=d.routes[0].geometry.coordinates;
     nav.from=[fLat,fLon];
     var km=(d.routes[0].distance/1000).toFixed(1),min=Math.round(d.routes[0].duration/60);
     setRouteInfo("\ud83e\udded "+km+" km \u00b7 ~"+min+" min "+(nav.active?"left":"drive")+" <span class='cpl' onclick='MA.stopNav()'>\u25a0 stop live</span> <span class='cpl' onclick='MA.clearRoute()'>\u2715</span>");
     if(!quiet)toast("Route drawn on map \u2713 \u2014 tap \u25b6 Start live to follow");
   }).catch(function(){if(!quiet)drawLine(fLat,fLon);});
}
/* ===== BLOCK:JS-LIVE-NAV ===== */
var nav={active:false,watch:null,umk:null,acirc:null,geom:null,from:null,lastCalc:0};
function hav(a,b,c,d){var R=6371000,t=Math.PI/180,dl=(c-a)*t,dn=(d-b)*t;
  var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a*t)*Math.cos(c*t)*Math.sin(dn/2)*Math.sin(dn/2);
  return 2*R*Math.asin(Math.sqrt(x));}
function distToRoute(la,lo){
  if(!nav.geom)return 1e9;
  var best=1e9;
  for(var i=0;i<nav.geom.length;i+=2){
    var d=hav(la,lo,nav.geom[i][1],nav.geom[i][0]);
    if(d<best)best=d;
  }
  return best;
}
function startNav(){
  if(!dest){toast("Pick a destination pin first");return;}
  if(!navigator.geolocation){toast("Geolocation not supported");return;}
  MA.stopNav();
  nav.active=true;
  toast("Live navigation on \u2014 follow the line");
  setRouteInfo("\ud83d\udccd locating you\u2026 <span class='cpl' onclick='MA.stopNav()'>\u25a0 stop</span>");
  nav.watch=navigator.geolocation.watchPosition(function(p){
    var la=p.coords.latitude,lo=p.coords.longitude,acc=p.coords.accuracy;
    if(!nav.umk){
      nav.umk=L_.circleMarker([la,lo],{radius:9,color:"#fff",weight:3,fillColor:"#2563eb",fillOpacity:1,zIndexOffset:1000}).addTo(map)
        .bindTooltip("You",{permanent:true,direction:"top",offset:[0,-10]});
      nav.acirc=L_.circle([la,lo],{radius:acc||50,color:"#2563eb",weight:1,fillColor:"#2563eb",fillOpacity:.12}).addTo(map);
      map.setView([la,lo],Math.max(map.getZoom(),15));
    }else{
      nav.umk.setLatLng([la,lo]);
      nav.acirc.setLatLng([la,lo]).setRadius(acc||50);
      if(!map.getBounds().pad(-.25).contains([la,lo]))map.panTo([la,lo]);
    }
    var dTo=hav(la,lo,dest[0],dest[1]);
    if(dTo<60){toast("\ud83c\udf89 You have arrived!");MA.stopNav();return;}
    var off=distToRoute(la,lo),now=Date.now();
    var moved=nav.from?hav(la,lo,nav.from[0],nav.from[1]):1e9;
    if(off>200){toast("Re-routing\u2026");drawRoute(la,lo,true);nav.lastCalc=now;return;}
    if((now-nav.lastCalc>25000&&moved>100)||!nav.geom){drawRoute(la,lo,true);nav.lastCalc=now;}
  },function(){toast("Location unavailable \u2014 check permission");MA.stopNav();},
  {enableHighAccuracy:true,maximumAge:3000,timeout:15000});
}
MA.stopNav=function(){
  if(nav.watch!==null){navigator.geolocation.clearWatch(nav.watch);nav.watch=null;}
  if(nav.umk){map.removeLayer(nav.umk);nav.umk=null;}
  if(nav.acirc){map.removeLayer(nav.acirc);nav.acirc=null;}
  if(nav.active){nav.active=false;toast("Live navigation off");}
  nav.geom=null;
};
MA.startNav=startNav;
MA.clearRoute=function(){if(routeL){map.removeLayer(routeL);routeL=null;}if(routeinfo){routeinfo.innerHTML="";routeinfo.style.display="none";}};
function drawLine(a,b){
  if(routeL)map.removeLayer(routeL);
  routeL=L_.polyline([[a,b],[dest[0],dest[1]]],{color:ac,weight:4,dashArray:"8 8"}).addTo(map);
  map.fitBounds(routeL.getBounds(),{padding:[30,30]});
  setRouteInfo("\ud83e\udded straight-line shown (route service busy)");
}
document.getElementById("origingo").onclick=function(){
  parseOrigin(document.getElementById("origin").value,function(pt){
    if(!pt){toast("Could not find that place \u2014 try a pincode or lat,lon");return;}
    if(!dest){toast("Tap a "+C.poiname+" pin first, then route");return;}
    drawRoute(pt.lat,pt.lon);
  });
};
document.getElementById("originme").onclick=function(){
  if(!dest){toast("Tap a "+C.poiname+" pin first, then route");return;}
  if(!navigator.geolocation){toast("Geolocation not supported");return;}
  navigator.geolocation.getCurrentPosition(function(p){drawRoute(p.coords.latitude,p.coords.longitude);},
    function(){toast("Location not allowed \u2014 type your start point instead");});
};
(function(){
  var b=document.createElement("button");
  b.type="button";b.id="navbtn";
  b.textContent="\u25b6 Start live (follow me)";
  b.style.cssText="padding:10px 14px;border-radius:10px;border:2px solid "+ac+";background:#fff;color:#0f172a;font-weight:800;cursor:pointer;font-size:.85rem";
  b.onclick=function(){startNav();};
  originWrap.insertBefore(b,originWrap.lastChild);
})();

/* ===== BLOCK:JS-EXTRAS ===== */
if(!EMBED){
  var locbtn=document.getElementById("locbtn");
  if(locbtn)locbtn.onclick=function(){
    if(!navigator.geolocation)return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(function(p){map.flyTo([p.coords.latitude,p.coords.longitude],13,{duration:1});},
      function(){alert("Location permission denied");});
  };
  var chips=document.getElementById("chips");
  if(chips)chips.querySelectorAll("a.chip").forEach(function(a){
    a.addEventListener("click",function(e){
      e.preventDefault();
      var slug=(a.getAttribute("href")||"").replace(/\//g,"");
      if(C.cities[slug])map.flyTo([C.cities[slug].lat,C.cities[slug].lon],11,{duration:.8});
    });
  });
  var fs=document.getElementById("filters");
  if(fs)fs.querySelectorAll(".fbtn").forEach(function(b){
    b.onclick=function(){flts[b.dataset.f]=!flts[b.dataset.f];b.classList.toggle("on");render();};
  });
  var addbtn=document.getElementById("addbtn"),addhint=document.getElementById("addhint");
  if(addbtn){
    addbtn.onclick=function(){
      if(map._adding){map._adding=false;addhint.style.display="none";map.getContainer().style.cursor="";return;}
      map._adding=true;addhint.style.display="block";map.getContainer().style.cursor="crosshair";
    };
    map.on("click",function(e){
      if(!map._adding)return;
      map._adding=false;addhint.style.display="none";map.getContainer().style.cursor="";
      suggest(e.latlng.lat,e.latlng.lng);
    });
  }
}else{
  /* embed mode: create city chips + search input if absent */
  var kc=document.getElementById("kwchips");
  if(kc&&!kc.children.length){
    Object.keys(C.cities).forEach(function(k,i){
      var b=document.createElement("button");
      b.type="button";b.textContent=C.cities[k].name;b.className="kwc"+(i===0?" on":"");
      b.onclick=function(){
        kc.querySelectorAll(".kwc").forEach(function(x){x.classList.remove("on");});
        b.classList.add("on");
        map.flyTo([C.cities[k].lat,C.cities[k].lon],11,{duration:.8});
      };
      kc.appendChild(b);
    });
  }
  if(!document.getElementById("kwq")){
    var sq=document.createElement("input");
    sq.id="kwq";sq.placeholder="Search any place, pincode or name\u2026";
    sq.style.cssText="width:100%;padding:10px 12px;border-radius:10px;border:1px solid #cbd5e1;font-family:inherit;font-size:.9rem;margin-bottom:8px;box-sizing:border-box";
    mapEl.parentNode.insertBefore(sq,mapEl);
    bindSearch(sq);
  }
  var near=document.getElementById("kwnear");
  if(near&&navigator.geolocation){
    near.onclick=function(){
      near.textContent="Locating\u2026";
      navigator.geolocation.getCurrentPosition(function(p){map.flyTo([p.coords.latitude,p.coords.longitude],13,{duration:1});near.textContent="Showing your area";},
        function(){near.textContent="Location unavailable";});
    };
  }
}

/* ===== BLOCK:JS-SUGGEST =====
   Fluid report/suggest card (never bleeds off screen) with one-tap quick options
   and a "newly added - N confirmations needed" badge. */
function confirmNeeded(){var S=window.SITE||{};return (S.confirmations&&S.confirmations.visitor)||75;}
function openSuggest(lat,lon){
  var dp=(lat!=null&&lon!=null)?(getDigiPin(lat,lon)||"outside-range"):"";
  if(document.getElementById("sugx"))return;
  var ov=document.createElement("div");ov.id="sugx";ov.className="sug-ov";
  var picks=["\ud83d\udccd Location is wrong","\ud83d\udeaa Closed / gate locked","\u26a1 Not working","\ud83d\udcb0 Not free anymore","\ud83d\udd01 Duplicate entry","\u2795 Add a new place"];
  ov.innerHTML='<div class="sug-card">'
    +'<div class="sug-top"><b>\ud83d\udce2 Report or add a '+C.poiname+'</b><button class="sug-x" aria-label="Close">\u2715</button></div>'
    +(lat!=null?'<div class="sug-loc">\ud83d\udccd '+lat.toFixed(5)+', '+lon.toFixed(5)+' \u00b7 DIGIPIN <b>'+dp+'</b> <span class="cpl" onclick="copyT(\''+dp+'\')">copy</span></div>':'')
    +'<div class="sug-q">Tap what you see \u2014 takes one second:</div>'
    +'<div class="sug-picks">'+picks.map(function(t){return '<button type="button" class="sug-pick">'+t+'</button>';}).join("")+'</div>'
    +'<textarea class="sug-note" rows="2" placeholder="Optional: name, hours, notes\u2026"></textarea>'
    +'<div class="sug-badge">\ud83c\udd95 New places show as <b>\u201cnewly added \u2014 '+confirmNeeded()+' confirmations needed\u201d</b> until verified by visitors.</div>'
    +'<button class="sug-send">Send report</button>'
    +'<div class="sug-foot">Data \u00a9 OpenStreetMap (ODbL) \u00b7 fixes appear after review</div></div>';
  document.body.appendChild(ov);
  var picked=null;
  ov.querySelectorAll(".sug-pick").forEach(function(b){b.onclick=function(){ov.querySelectorAll(".sug-pick").forEach(function(x){x.classList.remove("on");});b.classList.add("on");picked=b.textContent;};});
  ov.querySelector(".sug-x").onclick=function(){ov.remove();};
  ov.addEventListener("click",function(e){if(e.target===ov)ov.remove();});
  ov.querySelector(".sug-send").onclick=function(){
    var note=ov.querySelector(".sug-note").value.trim();
    var DB=(window.SITE&&window.SITE.db)||{};
    try{
      fetch((DB.url||"")+"/rest/v1/"+(DB.feedbackTable||"popup_feedback_ev"),{method:"POST",
        headers:{"Content-Type":"application/json","apikey":DB.key,"Authorization":"Bearer "+DB.key,"Prefer":"return=minimal"},
        body:JSON.stringify({url:location.href,path:location.pathname,referrer:document.referrer||"",
          responded:true,response_type:"suggest",transcript:((picked||"")+" "+(note||"")).slice(0,500)+" | "+dp,
          shown_at:new Date().toISOString(),session_id:(sessionStorage.getItem("fbk_sid")||""),user_agent:navigator.userAgent.slice(0,200)})});
    }catch(e){}
    ov.querySelector(".sug-card").innerHTML='<div class="sug-thanks">\ud83d\udc4d <b>Thank you!</b><p>Your report goes into the review queue. New places need '+confirmNeeded()+' visitor confirmations before they show as verified.</p></div>';
    setTimeout(function(){ov.remove();},2000);
  };
}
function suggest(lat,lon){openSuggest(lat,lon);}

/* ===== BLOCK:JS-UI-BUILD =====
   Filters (were empty), city/town chips block (below the map, data-driven),
   corner action cluster, route-colour picker, PWA bottom tabs.
   All generated from CFG + localStorage - no page rebuild needed. */
(function(){
  var LS_RECENT="ma_recent", LS_FAV="ma_fav";
  function ls(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
  function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function goCity(k){if(!C.cities[k])return;remember(k);map.flyTo([C.cities[k].lat,C.cities[k].lon],11,{duration:.8});}
  function remember(k){var r=(ls(LS_RECENT,"")||"").split(",").filter(Boolean);r=[k].concat(r.filter(function(x){return x!==k;}));lsSet(LS_RECENT,r.slice(0,8).join(","));}
  window.MA=window.MA||{};window.MA.rememberCity=remember;

  /* filters (container was empty -> filter buttons never existed) */
  var fs=document.getElementById("filters");
  if(fs&&!fs.children.length){
    (C.filters||[]).forEach(function(f){
      var b=el("button","fbtn",f.l);b.type="button";b.dataset.f=f.k;
      b.onclick=function(){flts[f.k]=!flts[f.k];b.classList.toggle("on");render();};
      fs.appendChild(b);
    });
  }

  /* city / town chips block - relocated to just below the map */
  var chips=document.getElementById("chips");
  if(chips&&!document.getElementById("chipsBlock")){
    var block=el("div","chipsblock");block.id="chipsBlock";
    block.appendChild(el("div","cb-head","<b>Browse by city &amp; area</b><span class=\"cb-hint\">tap to jump \u00b7 links open the city guide</span>"));
    var body=el("div","cb-body");
    function sec(label,keys,cls){
      var s=el("div","cb-sec"+(cls?" "+cls:""));
      s.appendChild(el("span","cb-lbl",label));
      var row=el("div","cb-row");
      keys.forEach(function(k){
        if(!C.cities[k])return;
        var a=el("a","cb-chip",C.cities[k].name);a.href="/"+k+"/";
        a.onclick=function(e){e.preventDefault();goCity(k);};
        row.appendChild(a);
      });
      s.appendChild(row);return s;
    }
    body.appendChild(sec("Cities",Object.keys(C.cities),""));
    if(C.towns&&C.towns.length){
      var t=el("div","cb-sec cb-more-sec");
      t.appendChild(el("span","cb-lbl","Popular towns &amp; districts"));
      var tr=el("div","cb-row");
      C.towns.forEach(function(x){var a=el("a","cb-chip",x.n);a.href=x.u||"#";a.onclick=function(e){if(x.lat&&x.lon){e.preventDefault();map.flyTo([x.lat,x.lon],12,{duration:.8});}};tr.appendChild(a);});
      t.appendChild(tr);body.appendChild(t);
    }
    var rec=(ls(LS_RECENT,"")||"").split(",").filter(Boolean);
    if(rec.length){body.appendChild(sec("\ud83d\udd58 Recent",rec,""));}
    var favs=(ls(LS_FAV,"")||"").split(",").filter(Boolean);
    if(favs.length){body.appendChild(sec("\u2b50 Favourites",favs,""));}
    block.appendChild(body);
    var more=el("button","cb-more","Hide \u25b4");more.type="button";
    more.onclick=function(){var closed=block.classList.toggle("cb-closed");more.textContent=closed?"Show more \u25be":"Hide \u25b4";};
    block.appendChild(more);
    if(mapEl.parentNode)mapEl.parentNode.insertBefore(block,mapEl.nextSibling);
  }

  /* hide the old add-spot button + hint (user: useless) */
  var ab=document.getElementById("addbtn");if(ab)ab.style.display="none";
  var ah=document.getElementById("addhint");if(ah)ah.style.display="none";

  /* route colour picker (inside the origin bar) */
  try{
    var orw=document.getElementById("origin")&&document.getElementById("origin").closest("div");
    if(orw&&!document.getElementById("routeColors")){
      var wrap=el("span","rc-wrap");wrap.id="routeColors";
      wrap.appendChild(el("span","rc-lbl","Route colour:"));
      ROUTE_COLORS.forEach(function(c){
        var d=el("button","rc-dot");d.type="button";d.title=c[1];d.style.background=c[0];
        if(routeColor()===c[0])d.classList.add("on");
        d.onclick=function(){setRouteColor(c[0]);wrap.querySelectorAll(".rc-dot").forEach(function(x){x.classList.remove("on");});d.classList.add("on");};
        wrap.appendChild(d);
      });
      orw.appendChild(wrap);
    }
  }catch(e){}

  /* corner action cluster - collapsible, one-word labels, open by default for new visitors */
  if(!document.getElementById("cornerCluster")){
    var cl=el("div","cornerCluster");cl.id="cornerCluster";
    var st=ls("ma_corner","open"); if(st!=="closed")cl.classList.add("open");
    function cbtn(id,icon,label,fn){var b=el("button","cbtn","<span class=\"cb-ic\">"+icon+"</span><span class=\"cb-lb\">"+label+"</span>");b.id=id;b.type="button";b.title=label;b.setAttribute("aria-label",label);b.onclick=fn;return b;}
    cl.appendChild(cbtn("cbMapTheme","\ud83c\udf19","Map tiles",cycleMapTheme));
    mapThemeBtn=document.getElementById("cbMapTheme");
    cl.appendChild(cbtn("cbFav","\u2b50","Favourite",function(){
      var c=map.getCenter(),best=null,bd=1e9;
      Object.keys(C.cities).forEach(function(k){var d=Math.pow(C.cities[k].lat-c.lat,2)+Math.pow(C.cities[k].lon-c.lng,2);if(d<bd){bd=d;best=k;}});
      if(!best)return;
      var favs=(ls(LS_FAV,"")||"").split(",").filter(Boolean);var i=favs.indexOf(best);
      if(i<0){favs.push(best);toast(C.cities[best].name+" added to favourites");}else{favs.splice(i,1);toast(C.cities[best].name+" removed");}
      lsSet(LS_FAV,favs.join(","));
    }));
    cl.appendChild(cbtn("cbReport","\ud83d\udce2","Report",function(){openSuggest();}));
    cl.appendChild(cbtn("cbFeedback","\ud83d\udcac","Feedback",function(){if(window.openFeedback)window.openFeedback();else toast("Feedback: use the popup or email us");}));
    var tog=el("button","cbtn cbtoggle","<span class=\"cb-ic\">\u2699\ufe0f</span><span class=\"cb-lb\">Tools</span>");
    tog.type="button";tog.id="cbToggle";tog.title="Show / hide tools";
    tog.onclick=function(){var open=cl.classList.toggle("open");lsSet("ma_corner",open?"open":"closed");};
    cl.appendChild(tog);
    document.body.appendChild(cl);
  }

  /* PWA bottom tabs (mobile) - app-like bar with a centre circular Add button */
  if(!EMBED&&!document.getElementById("pwaTabs")){
    var tabs=el("nav","pwatabs");tabs.id="pwaTabs";
    function tab(href,icon,label,fn){var a=el("a","pwtab","<span class=\"pt-ic\">"+icon+"</span><span class=\"pt-lb\">"+label+"</span>");a.href=href;
      a.onclick=function(e){if(fn){e.preventDefault();fn();}else{var t=document.querySelector(href);if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth",block:"start"});}}};return a;}
    tabs.appendChild(tab("#map","\ud83d\uddfa","Map"));
    tabs.appendChild(tab("#block-content","\ud83d\udd0c","Guides"));
    var add=el("button","pwadd","\u2795");add.type="button";add.title="Add a place";add.setAttribute("aria-label","Add a place");
    add.onclick=function(){openSuggest();};
    tabs.appendChild(add);
    tabs.appendChild(tab("#block-what-does-charging-cost","\ud83d\udcb0","Costs"));
    tabs.appendChild(tab("#block-frequently-asked-questions","\u2753","FAQ"));
    document.body.appendChild(tabs);
  }
})();

loadAll();
})();
