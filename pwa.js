/* pwa.js — BLOCK:PWA-INSTALL.
   Install experience, fully conditional:
   - If the app is already running installed (display-mode: standalone / navigator.standalone),
     nothing is ever shown, and a 'pwa_launch' GA event records the visit (install confirmation
     signal on the data side).
   - 'appinstalled' marks localStorage pwaInstalled=1 and hides the card.
   - If the app is later uninstalled, the stored flag no longer matches standalone mode, so
     prompts resume automatically.
   - Re-prompt cadence: random 7-30 days after the last time the card was shown
     (site.js -> pwa.minDays / pwa.maxDays), so we can see when a visitor converts.
   GA events: pwa_launch | pwa_prompt_shown | pwa_install_click | pwa_install_ok | pwa_dismiss */
(function(){
"use strict";
var S=window.SITE&&window.SITE.pwa||{};
var MIN=(S.minDays||7)*86400000, MAX=(S.maxDays||30)*86400000;
var LS_PROMPT="pwaPromptAt", LS_INSTALLED="pwaInstalled";
function ga(ev,extra){try{window.gtag&&window.gtag("event",ev,extra||{})}catch(e){}}
function standalone(){
  return window.matchMedia("(display-mode: standalone)").matches
      || window.matchMedia("(display-mode: minimal-ui)").matches
      || window.navigator.standalone===true;
}
if("serviceWorker" in navigator){ try{navigator.serviceWorker.register("/sw.js").catch(function(){})}catch(e){} }
if(standalone()){ ga("pwa_launch"); return; }          /* installed: never show UI */
try{ if(localStorage.getItem(LS_INSTALLED)==="1"){ localStorage.removeItem(LS_INSTALLED); } }catch(e){}
/* ^ stored flag but NOT running standalone = uninstalled -> resume prompts */

var deferred=null, card=null, shownLogged=false;
function due(){
  try{ var last=+localStorage.getItem(LS_PROMPT)||0; return Date.now()-last>=MIN; }catch(e){ return true; }
}
function markShown(){ try{ localStorage.setItem(LS_PROMPT,String(Date.now())); }catch(e){} }
function build(){
  card=document.createElement("div");card.id="installCard";
  card.innerHTML='<div class="ic-top"><div class="ic-ico">\u26a1</div>'
    +'<div><div class="ic-t">Install '+((window.SITE&&window.SITE.shortName)||"this map")+'</div>'
    +'<div class="ic-s">Works offline \u00b7 one tap from your home screen \u00b7 no app store</div></div>'
    +'<button class="ic-x" aria-label="Not now">\u2715</button></div>'
    +'<div class="ic-row"><button class="ic-go">\ud83d\udcf2 Install app</button><button class="ic-no">Not now</button></div>';
  card.querySelector(".ic-x").onclick=function(){hide("pwa_dismiss")};
  card.querySelector(".ic-no").onclick=function(){hide("pwa_dismiss")};
  card.querySelector(".ic-go").onclick=function(){
    ga("pwa_install_click");
    if(deferred){ deferred.prompt(); deferred.userChoice.then(function(){ deferred=null; }); }
    else { if(window.showToast){window.showToast("Use your browser menu \u2192 Install / Add to Home Screen");} hide(null); }
  };
  document.body.appendChild(card);
}
function show(){ if(!card)build(); markShown(); card.classList.add("show"); if(!shownLogged){ga("pwa_prompt_shown");shownLogged=true;} }
function hide(ev){ if(ev)ga(ev); if(card)card.classList.remove("show"); }
window.addEventListener("beforeinstallprompt",function(e){ e.preventDefault(); deferred=e; if(due())show(); });
window.addEventListener("appinstalled",function(){ try{localStorage.setItem(LS_INSTALLED,"1")}catch(e){} ga("pwa_install_ok"); hide(null); deferred=null; });
})();
