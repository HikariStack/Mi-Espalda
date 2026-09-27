/* Mi Espalda — hojas modales y navegación */
(function (A) {
  "use strict";

  A.openSheet = function (title, bodyHtml, footHtml, onMount) {
    A.closeSheet();
    var bd = document.createElement("div");
    bd.className = "backdrop"; bd.id = "sheetBackdrop";
    bd.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + A.esc(title) + '">' +
        '<div class="sheet-grab"></div>' +
        '<div class="sheet-head"><h2>' + A.esc(title) + '</h2>' +
        '<button class="icon-btn" data-close-sheet aria-label="Cerrar">' + A.icon("close") + '</button></div>' +
        '<div class="sheet-body">' + bodyHtml + '</div>' +
        (footHtml ? '<div class="sheet-foot">' + footHtml + '</div>' : '') +
      '</div>';
    bd.addEventListener("click", function (ev) {
      if (ev.target === bd || ev.target.closest("[data-close-sheet]")) A.closeSheet();
    });
    document.body.appendChild(bd);
    document.body.style.overflow = "hidden";
    if (onMount) onMount(bd.querySelector(".sheet"));
    return bd.querySelector(".sheet");
  };
  A.closeSheet = function () {
    var bd = document.getElementById("sheetBackdrop");
    if (bd) bd.remove();
    if (!document.getElementById("player")) document.body.style.overflow = "";
  };

  A.go = function (tab) {
    document.querySelectorAll(".tabbar button").forEach(function (b) {
      var on = b.getAttribute("data-tab") === tab;
      b.classList.toggle("on", on);
      b.setAttribute("aria-current", on ? "page" : "false");
    });
    document.querySelectorAll(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + tab); });
    try { localStorage.setItem("espalda_tab", tab); } catch (e) {}
    window.scrollTo(0, 0);
  };
})(window.App);
