/* Mi Espalda — pestaña Hoy: resumen, mapa corporal, registro e historial */
(function (A) {
  "use strict";
  var mapDays = 14, pendingDelete = null, histLimit = 8;
  var TRIGGERS = ["Dormir mal", "Mucho rato sentado", "Postura", "Esfuerzo / cargar peso", "Estrés", "Después de entrenar", "Frío"];

  function momentNow() { var h = new Date().getHours(); return h < 6 ? "Madrugada" : h < 13 ? "Mañana" : h < 20 ? "Tarde" : "Noche"; }

  /* ---------- resumen ---------- */
  function metrics() {
    var logs = A.data.logs, today = A.iso();
    var sorted = logs.slice().sort(function (a, b) { return (b.date + b.id) > (a.date + a.id) ? 1 : -1; });
    var last = sorted[0];
    var cut7 = A.iso(A.daysAgo(6));
    var l7 = logs.filter(function (l) { return l.date >= cut7; });
    var avg7 = l7.length ? l7.reduce(function (s, l) { return s + l.intensity; }, 0) / l7.length : null;
    var lastWake = sorted.filter(function (l) { return l.wokeAtNight; })[0];
    var nightsOk = lastWake ? Math.round((A.parse(today) - A.parse(lastWake.date)) / 86400000) : null;
    var weekStart = A.daysAgo((new Date().getDay() + 6) % 7);
    var trains = A.data.activities.filter(function (a) { return A.parse(a.date) >= weekStart; }).length;
    return [
      { v: last ? last.intensity + '<small>/10</small>' : "–", l: last ? "Último dolor · " + A.fmtDay(last.date).toLowerCase() : "Último dolor" },
      { v: avg7 == null ? "–" : avg7.toFixed(1), l: "Media últimos 7 días" },
      { v: nightsOk == null ? "–" : nightsOk + '<small> ' + (nightsOk === 1 ? "noche" : "noches") + '</small>', l: "Sin despertarte por dolor" },
      { v: trains + '<small> ' + (trains === 1 ? "sesión" : "sesiones") + '</small>', l: "Actividad esta semana" }
    ];
  }

  A.renderToday = function () {
    var v = document.getElementById("view-hoy");
    var h = new Date().getHours();
    var hello = h < 6 ? "Buenas noches" : h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
    v.innerHTML =
      '<div class="section-head"><div><div class="eyebrow">' + A.esc(new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })) + '</div><h2>' + hello + '</h2></div></div>' +
      '<button class="cta-card" id="ctaPain"><span class="ic">' + A.icon("pulse") + '</span><span><b>Registrar dolor</b><span>Zona, intensidad y si te ha despertado</span></span></button>' +
      '<div class="btn-row"><button class="btn" id="ctaAct">' + A.icon("plus") + ' Registrar actividad</button></div>' +
      '<div class="today-grid">' + metrics().map(function (m) {
        return '<div class="metric"><div class="v">' + m.v + '</div><div class="l">' + A.esc(m.l) + '</div></div>';
      }).join("") + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Mapa de dolor</h3><p>Intensidad máxima por zona. Toca una zona para ver el detalle.</p></div></div>' +
        '<div class="seg" id="mapRange" style="margin-bottom:12px;">' +
          [[7, "7 días"], [14, "14 días"], [30, "30 días"], [0, "Todo"]].map(function (r) { return '<button data-d="' + r[0] + '" class="' + (r[0] === mapDays ? "on" : "") + '">' + r[1] + '</button>'; }).join("") +
        '</div>' +
        '<div class="bodymap-layout"><div id="homeMap" style="width:100%;display:flex;justify-content:center;">' + A.bodyMap({ mode: "view", days: mapDays }) + '</div>' +
        '<div class="legend"><span><i style="background:var(--none)"></i>Sin dolor</span><span><i style="background:var(--mild)"></i>Leve 1–3</span><span><i style="background:var(--mod)"></i>Moderado 4–6</span><span><i style="background:var(--severe)"></i>Intenso 7–10</span></div>' +
        '<div class="zone-detail" id="zoneDetail"><span class="muted">Toca una zona del cuerpo.</span></div></div>' +
      '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Historial</h3><p>Dolor y actividad registrados</p></div></div><div id="historyList">' + historyHtml() + '</div></div>' +
      '<p class="disclaimer">Esta app es un diario personal y no sustituye el consejo de un médico o fisioterapeuta.</p>';

    v.querySelector("#ctaPain").onclick = function () { A.openPainForm(); };
    v.querySelector("#ctaAct").onclick = function () { A.openActivityForm(); };
    v.querySelector("#mapRange").onclick = function (ev) {
      var b = ev.target.closest("[data-d]"); if (!b) return;
      mapDays = +b.getAttribute("data-d"); A.renderToday();
    };
    v.querySelector("#homeMap").onclick = function (ev) {
      var z = ev.target.closest("[data-zone]"); if (!z) return;
      var id = z.getAttribute("data-zone"), mx = A.zoneMax(id, mapDays), n = A.zoneCount(id, mapDays);
      var last = A.data.logs.filter(function (l) { return l.zones.indexOf(id) !== -1; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0];
      document.getElementById("zoneDetail").innerHTML = '<b>' + A.esc(A.zoneLabel(id)) + '</b><br><span class="ink2">' +
        (n ? n + (n === 1 ? " registro" : " registros") + " · máximo " + mx + "/10" + (last ? " · último " + A.fmtDay(last.date).toLowerCase() : "") : "Sin dolor registrado en este periodo") + '</span>';
    };
    v.querySelector("#historyList").onclick = onHistoryClick;
  };

  /* ---------- historial ---------- */
  function historyHtml() {
    var evs = [];
    A.data.logs.forEach(function (l) { evs.push({ k: "log", d: l }); });
    A.data.activities.forEach(function (a) { evs.push({ k: "act", d: a }); });
    if (!evs.length) return '<div class="empty">Todavía no hay registros.<br>Empieza con «Registrar dolor».</div>';
    evs.sort(function (a, b) { return (b.d.date + b.d.id) > (a.d.date + a.d.id) ? 1 : -1; });
    var groups = {}, order = [];
    var more = evs.length > histLimit;
    evs.slice(0, histLimit).forEach(function (e) { if (!groups[e.d.date]) { groups[e.d.date] = []; order.push(e.d.date); } groups[e.d.date].push(e); });
    return order.map(function (date) {
      return '<div class="day-group"><div class="day-label">' + A.esc(A.fmtDay(date)) + '</div>' + groups[date].map(function (e) {
        var d = e.d, del = pendingDelete === d.id
          ? '<button class="btn sm danger" data-del="' + e.k + '" data-id="' + d.id + '">Borrar</button>'
          : '<button class="x" data-ask="' + d.id + '" aria-label="Borrar">×</button>';
        if (e.k === "log") {
          var zones = d.zones.length ? d.zones.map(A.zoneLabel).join(", ") : "Sin zona concreta";
          var extra = [];
          if (d.wokeAtNight) extra.push("Te despertó" + (d.wokeTime ? " a las " + d.wokeTime : ""));
          if (d.triggers && d.triggers.length) extra.push(d.triggers.join(", "));
          return '<div class="entry"><div class="badge" style="background:' + A.painColor(d.intensity) + (d.intensity ? "" : ";color:var(--ink-2)") + '">' + d.intensity + '</div>' +
            '<div class="body"><div class="t">' + A.esc(d.moment) + ' · ' + A.painWord(d.intensity) + '</div><div class="s">' + A.esc(zones) + '</div>' +
            (extra.length ? '<div class="s">' + A.esc(extra.join(" · ")) + '</div>' : "") +
            (d.notes ? '<div class="n">' + A.esc(d.notes) + '</div>' : "") + '</div>' + del + '</div>';
        }
        return '<div class="entry"><div class="badge act">' + A.icon(d.type === "estiramientos" ? "stretch" : "dumbbell") + '</div>' +
          '<div class="body"><div class="t">' + A.esc(A.ACT[d.type] || d.type) + (d.durationMin ? ' · ' + d.durationMin + ' min' : '') + '</div>' +
          (d.notes ? '<div class="n">' + A.esc(d.notes) + '</div>' : "") + '</div>' + del + '</div>';
      }).join("") + '</div>';
    }).join("") + (more ? '<button class="btn block sm" data-more style="margin-top:10px;">Ver más registros</button>' : "");
  }
  function onHistoryClick(ev) {
    if (ev.target.closest("[data-more]")) { histLimit += 15; document.getElementById("historyList").innerHTML = historyHtml(); return; }
    var ask = ev.target.closest("[data-ask]");
    if (ask) { pendingDelete = ask.getAttribute("data-ask"); document.getElementById("historyList").innerHTML = historyHtml(); return; }
    var del = ev.target.closest("[data-del]");
    if (del) {
      var id = del.getAttribute("data-id");
      if (del.getAttribute("data-del") === "log") A.data.logs = A.data.logs.filter(function (l) { return l.id !== id; });
      else A.data.activities = A.data.activities.filter(function (a) { return a.id !== id; });
      pendingDelete = null; A.save(); A.renderAll(); A.toast("Registro borrado");
    }
  }

  /* ---------- formulario de dolor ---------- */
  A.openPainForm = function () {
    var s = { date: A.iso(), moment: momentNow(), zones: [], intensity: null, woke: false, wokeTime: "", triggers: [], notes: "" };
    var scale = "";
    for (var i = 0; i <= 10; i++) scale += '<button type="button" data-v="' + i + '" aria-label="Intensidad ' + i + '">' + i + '</button>';
    var body =
      '<div class="field"><span class="label">¿Dónde te duele? Toca una o varias zonas</span>' +
        '<div class="bodymap-layout"><div id="pfMap" style="width:100%;display:flex;justify-content:center;">' + A.bodyMap({ mode: "select", selected: s.zones }) + '</div>' +
        '<div class="chips sel-zones" id="pfSel"></div></div></div>' +
      '<div class="field"><div class="switch-row"><span class="label">Intensidad</span><span class="intensity-now"><b id="pfNum">–</b><span class="ink2" id="pfWord">Elige de 0 a 10</span></span></div>' +
        '<div class="scale" id="pfScale">' + scale + '</div><div class="scale-caption"><span>Sin dolor</span><span>El peor imaginable</span></div></div>' +
      '<div class="field"><span class="label">Momento</span><div class="seg" id="pfMoment">' +
        ["Madrugada", "Mañana", "Tarde", "Noche"].map(function (m) { return '<button type="button" data-m="' + m + '" class="' + (m === s.moment ? "on" : "") + '">' + m + '</button>'; }).join("") + '</div></div>' +
      '<div class="field"><div class="switch-row"><label for="pfWoke">¿Te ha despertado por la noche?</label><button type="button" class="switch" id="pfWoke" role="switch" aria-checked="false"></button></div>' +
        '<div id="pfWokeTime" hidden><input type="time" id="pfTime" aria-label="Hora a la que te despertaste"></div></div>' +
      '<div class="field"><span class="label">¿Qué crees que lo ha provocado?</span><div class="chips" id="pfTrig">' +
        TRIGGERS.map(function (t) { return '<button type="button" class="chip" data-t="' + A.esc(t) + '">' + A.esc(t) + '</button>'; }).join("") + '</div></div>' +
      '<div class="field"><label for="pfDate">Fecha</label><input type="date" id="pfDate" value="' + s.date + '" max="' + A.iso() + '"></div>' +
      '<div class="field"><label for="pfNotes">Notas</label><textarea id="pfNotes" placeholder="Postura al dormir, tipo de dolor (punzante, sordo…), qué te alivió"></textarea></div>';
    var foot = '<button class="btn primary block" id="pfSave">Guardar registro</button>';

    A.openSheet("Registrar dolor", body, foot, function (sh) {
      function drawSel() {
        sh.querySelector("#pfMap").innerHTML = A.bodyMap({ mode: "select", selected: s.zones });
        sh.querySelector("#pfSel").innerHTML = s.zones.length
          ? s.zones.map(function (z) { return '<span class="chip static">' + A.esc(A.zoneLabel(z)) + '</span>'; }).join("")
          : '<span class="muted" style="font-size:13px;">Ninguna zona seleccionada</span>';
      }
      drawSel();
      sh.querySelector("#pfMap").onclick = function (ev) {
        var z = ev.target.closest("[data-zone]"); if (!z) return;
        var id = z.getAttribute("data-zone"), k = s.zones.indexOf(id);
        if (k === -1) s.zones.push(id); else s.zones.splice(k, 1);
        drawSel();
      };
      sh.querySelector("#pfScale").onclick = function (ev) {
        var b = ev.target.closest("[data-v]"); if (!b) return;
        s.intensity = +b.getAttribute("data-v");
        sh.querySelectorAll("#pfScale button").forEach(function (x) {
          var on = x === b; x.classList.toggle("on", on);
          x.style.background = on ? (s.intensity ? A.painColor(s.intensity) : "var(--ink)") : "";
        });
        sh.querySelector("#pfNum").textContent = s.intensity;
        sh.querySelector("#pfWord").textContent = A.painWord(s.intensity);
      };
      sh.querySelector("#pfMoment").onclick = function (ev) {
        var b = ev.target.closest("[data-m]"); if (!b) return;
        s.moment = b.getAttribute("data-m");
        sh.querySelectorAll("#pfMoment button").forEach(function (x) { x.classList.toggle("on", x === b); });
      };
      sh.querySelector("#pfWoke").onclick = function () {
        s.woke = !s.woke;
        this.classList.toggle("on", s.woke); this.setAttribute("aria-checked", s.woke);
        sh.querySelector("#pfWokeTime").hidden = !s.woke;
      };
      sh.querySelector("#pfTrig").onclick = function (ev) {
        var b = ev.target.closest("[data-t]"); if (!b) return;
        var t = b.getAttribute("data-t"), k = s.triggers.indexOf(t);
        if (k === -1) s.triggers.push(t); else s.triggers.splice(k, 1);
        b.classList.toggle("on", k === -1);
      };
      sh.querySelector("#pfSave").onclick = function () {
        if (s.intensity == null) { A.toast("Elige la intensidad del dolor"); sh.querySelector("#pfScale").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
        A.data.logs.push({
          id: A.uid(), date: sh.querySelector("#pfDate").value || A.iso(), moment: s.moment, zones: s.zones.slice(),
          intensity: s.intensity, wokeAtNight: s.woke, wokeTime: s.woke ? sh.querySelector("#pfTime").value : "",
          triggers: s.triggers.slice(), notes: sh.querySelector("#pfNotes").value.trim()
        });
        A.save(); A.closeSheet(); A.renderAll(); A.toast("Dolor registrado");
      };
    });
  };

  /* ---------- formulario de actividad ---------- */
  A.openActivityForm = function () {
    var s = { type: "gimnasio", dur: 45 };
    var body =
      '<div class="field"><span class="label">Tipo de actividad</span><div class="chips" id="afType">' +
        Object.keys(A.ACT).map(function (k) { return '<button type="button" class="chip' + (k === s.type ? " on" : "") + '" data-k="' + k + '">' + A.ACT[k] + '</button>'; }).join("") + '</div></div>' +
      '<div class="field"><span class="label">Duración</span><div class="switch-row"><div class="stepper"><button type="button" data-s="-5" aria-label="Menos">−</button><span id="afDur">' + s.dur + ' min</span><button type="button" data-s="5" aria-label="Más">+</button></div></div></div>' +
      '<div class="field"><label for="afDate">Fecha</label><input type="date" id="afDate" value="' + A.iso() + '" max="' + A.iso() + '"></div>' +
      '<div class="field"><label for="afNotes">Notas</label><textarea id="afNotes" placeholder="Qué hiciste, cómo te sentiste"></textarea></div>';
    A.openSheet("Registrar actividad", body, '<button class="btn primary block" id="afSave">Guardar actividad</button>', function (sh) {
      sh.querySelector("#afType").onclick = function (ev) {
        var b = ev.target.closest("[data-k]"); if (!b) return;
        s.type = b.getAttribute("data-k");
        sh.querySelectorAll("#afType .chip").forEach(function (x) { x.classList.toggle("on", x === b); });
      };
      sh.querySelector(".stepper").onclick = function (ev) {
        var b = ev.target.closest("[data-s]"); if (!b) return;
        s.dur = Math.max(5, Math.min(240, s.dur + +b.getAttribute("data-s")));
        sh.querySelector("#afDur").textContent = s.dur + " min";
      };
      sh.querySelector("#afSave").onclick = function () {
        A.data.activities.push({ id: A.uid(), date: sh.querySelector("#afDate").value || A.iso(), type: s.type, durationMin: s.dur, notes: sh.querySelector("#afNotes").value.trim() });
        A.save(); A.closeSheet(); A.renderAll(); A.toast("Actividad guardada");
      };
    });
  };
})(window.App);
