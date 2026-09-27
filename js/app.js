/* Mi Espalda — arranque */
(function (A) {
  "use strict";

  A.renderAll = function () {
    A.renderToday();
    A.renderTrain("gym");
    A.renderTrain("stretch");
    A.renderProgress();
  };

  document.querySelector(".tabbar").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-tab]"); if (b) A.go(b.getAttribute("data-tab"));
  });

  function start() {
    A.renderAll();
    var tab = "hoy";
    try { tab = localStorage.getItem("espalda_tab") || "hoy"; } catch (e) {}
    if (location.hash && /^#(hoy|gym|stretch|progress)$/.test(location.hash)) tab = location.hash.slice(1);
    A.go(tab);
  }
  start();

  // Service worker (solo cuando la app está alojada en tu propio dominio)
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent/.test(location.hostname)) {
    try { navigator.serviceWorker.register("sw.js").catch(function () {}); } catch (e) {}
  }
})(window.App);
