/* theme.js — BLOCK:THEME-SWITCH.
   Bulb button (fixed bottom-right): cycles Light -> Dark -> Auto (follow device).
   Choice saved in localStorage 'theme'; html[data-theme] drives theme.css.
   Default (no choice yet) = auto. Pages inline a 1-line bootstrap so there is no flash. */
(function(){
"use strict";
var ORDER=["auto","light","dark"];
var LABEL={auto:"Auto (device)",light:"Light",dark:"Dark"};
var ICON={auto:"\ud83d\udca1",light:"\ud83d\udca1",dark:"\ud83d\udca1"};
var HINT={auto:"Theme: Auto \u2014 follows your device",light:"Theme: Light",dark:"Theme: Dark"};
function get(){try{var t=localStorage.getItem("theme");return ORDER.indexOf(t)>=0?t:"auto"}catch(e){return "auto"}}
function set(t){try{localStorage.setItem("theme",t)}catch(e){}document.documentElement.setAttribute("data-theme",t);syncUI();try{window.gtag&&window.gtag("event","theme_set",{theme:t})}catch(e){}}
var btn;
function syncUI(){if(!btn)return;btn.innerHTML=ICON[get()]+'<span class="tl">'+LABEL[get()]+'</span>';btn.setAttribute("aria-label",HINT[get()]);btn.title=HINT[get()];}
function make(){
  btn=document.createElement("button");btn.id="themeBtn";btn.type="button";
  btn.addEventListener("click",function(){
    var nx=ORDER[(ORDER.indexOf(get())+1)%ORDER.length];set(nx);
    var msg=HINT[nx];
    if(window.showToast){window.showToast(msg);}
    else{var t=document.getElementById("toast");if(t){t.textContent=msg;t.className="show";setTimeout(function(){t.className="";},1600);}}
  });
  document.body.appendChild(btn);syncUI();
}
document.documentElement.setAttribute("data-theme",get());
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",make);}else{make();}
})();
