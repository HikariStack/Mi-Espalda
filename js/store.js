/* Mi Espalda — datos, utilidades y zonas */
window.App = window.App || {};
(function (A) {
  "use strict";

  var KEY = "espalda_track_v1";

  A.ZONES = [
    { id: "cervical",   label: "Cervical",            short: "Cervical" },
    { id: "trap-izq",   label: "Trapecio/hombro izq.", short: "Hombro izq." },
    { id: "trap-der",   label: "Trapecio/hombro der.", short: "Hombro der." },
    { id: "dorsal-izq", label: "Dorsal izquierda",    short: "Dorsal izq." },
    { id: "dorsal-der", label: "Dorsal derecha",      short: "Dorsal der." },
    { id: "lumbar-izq", label: "Lumbar izquierda",    short: "Lumbar izq." },
    { id: "lumbar-der", label: "Lumbar derecha",      short: "Lumbar der." },
    { id: "sacro",      label: "Sacro",               short: "Sacro" },
    { id: "gluteo-izq", label: "Glúteo/cadera izq.",  short: "Glúteo izq." },
    { id: "gluteo-der", label: "Glúteo/cadera der.",  short: "Glúteo der." },
    { id: "pierna-izq", label: "Ciática pierna izq.", short: "Pierna izq." },
    { id: "pierna-der", label: "Ciática pierna der.", short: "Pierna der." }
  ];
  var LEGACY = {
    "dorsal": ["dorsal-izq", "dorsal-der"], "lumbar": ["lumbar-izq", "lumbar-der"],
    "cadera-izq": ["gluteo-izq"], "cadera-der": ["gluteo-der"],
    "ciatica-izq": ["pierna-izq"], "ciatica-der": ["pierna-der"]
  };

  A.zoneLabel = function (id) {
    for (var i = 0; i < A.ZONES.length; i++) if (A.ZONES[i].id === id) return A.ZONES[i].label;
    return id;
  };

  function blank() { return { logs: [], activities: [], routines: [], sessions: [] }; }

  function load() {
    var d = null;
    try { var raw = localStorage.getItem(KEY); if (raw) d = JSON.parse(raw); } catch (e) {}
    d = d || blank();
    d.logs = d.logs || []; d.activities = d.activities || [];
    d.routines = d.routines || []; d.sessions = d.sessions || [];
    // migrar zonas antiguas
    d.logs.forEach(function (l) {
      var out = [];
      (l.zones || []).forEach(function (z) {
        (LEGACY[z] || [z]).forEach(function (n) { if (out.indexOf(n) === -1) out.push(n); });
      });
      l.zones = out;
      if (l.moment) l.moment = l.moment.charAt(0).toUpperCase() + l.moment.slice(1);
    });
    return d;
  }
  A.data = load();
  A.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(A.data)); return true; } catch (e) { return false; }
  };

  /* ---------- utilidades ---------- */
  A.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  A.iso = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  };
  A.parse = function (iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  A.daysAgo = function (n) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; };
  A.fmtDay = function (iso) {
    var t = A.iso(), y = A.iso(A.daysAgo(1));
    if (iso === t) return "Hoy";
    if (iso === y) return "Ayer";
    return A.parse(iso).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  };
  A.fmtShort = function (iso) {
    return A.parse(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };
  A.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  A.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  A.painColor = function (v) {
    if (v == null || v <= 0) return "var(--none)";
    if (v <= 3) return "var(--mild)";
    if (v <= 6) return "var(--mod)";
    return "var(--severe)";
  };
  A.painWord = function (v) {
    if (v <= 0) return "Sin dolor";
    if (v <= 3) return "Leve";
    if (v <= 6) return "Moderado";
    if (v <= 8) return "Intenso";
    return "Muy intenso";
  };

  A.zoneMax = function (zoneId, days) {
    var cut = days ? A.iso(A.daysAgo(days - 1)) : "0000";
    var max = 0;
    A.data.logs.forEach(function (l) {
      if (l.date >= cut && l.zones.indexOf(zoneId) !== -1 && l.intensity > max) max = l.intensity;
    });
    return max;
  };
  A.zoneCount = function (zoneId, days) {
    var cut = days ? A.iso(A.daysAgo(days - 1)) : "0000";
    return A.data.logs.filter(function (l) { return l.date >= cut && l.zones.indexOf(zoneId) !== -1; }).length;
  };

  A.ACT = {
    gimnasio: "Gimnasio", estiramientos: "Estiramientos", natacion: "Natación",
    pilates: "Pilates", yoga: "Yoga", caminar: "Caminar", otro: "Otra"
  };

  /* toast */
  A.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status");
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  };

  /* tooltip */
  var tipEl = null, tipT = null;
  A.tip = function (el, html) {
    if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "tip"; document.body.appendChild(tipEl); }
    var r = el.getBoundingClientRect();
    tipEl.innerHTML = html;
    tipEl.style.left = Math.min(window.innerWidth - 70, Math.max(70, r.left + r.width / 2)) + "px";
    tipEl.style.top = r.top + "px";
    tipEl.hidden = false;
    clearTimeout(tipT);
    tipT = setTimeout(function () { tipEl.hidden = true; }, 2400);
  };

  /* iconos */
  A.icon = function (name) {
    var p = {
      plus: '<path d="M12 5v14M5 12h14"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      play: '<path d="M7 5v14l12-7z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M8 5v14M16 5v14"/>',
      next: '<path d="M6 5v14l10-7z" fill="currentColor" stroke="none"/><path d="M18 5v14"/>',
      prev: '<path d="M18 5v14L8 12z" fill="currentColor" stroke="none"/><path d="M6 5v14"/>',
      shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
      edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
      trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
      up: '<path d="m6 15 6-6 6 6"/>',
      down: '<path d="m6 9 6 6 6-6"/>',
      dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
      stretch: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7l-4 6M12 14l4 6M5 9l7 1 7-1"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
      today: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
      pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
      sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
      mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 4 6M21 9l-4 6"/>',
      check: '<path d="m5 12 5 5 9-10"/>',
      moon: '<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>'
    }[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  };
})(window.App);
