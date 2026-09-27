/* Mi Espalda — pestaña Progreso */
(function (A) {
  "use strict";
  var range = 30;

  function dailyMax() {
    var m = {};
    A.data.logs.forEach(function (l) { m[l.date] = Math.max(m[l.date] == null ? -1 : m[l.date], l.intensity); });
    return m;
  }
  function avg(a) { return a.length ? a.reduce(function (s, v) { return s + v; }, 0) / a.length : null; }

  function tiles() {
    var cut = A.iso(A.daysAgo(range - 1)), prevCut = A.iso(A.daysAgo(range * 2 - 1));
    var cur = A.data.logs.filter(function (l) { return l.date >= cut; });
    var prev = A.data.logs.filter(function (l) { return l.date >= prevCut && l.date < cut; });
    var a1 = avg(cur.map(function (l) { return l.intensity; })), a0 = avg(prev.map(function (l) { return l.intensity; }));
    var trend = "";
    if (a1 != null && a0 != null) {
      var d = a1 - a0;
      trend = Math.abs(d) < 0.2 ? "Igual que el periodo anterior" : (d < 0 ? "▼ " + Math.abs(d).toFixed(1) + " menos que antes" : "▲ " + d.toFixed(1) + " más que antes");
    }
    var dm = dailyMax(), pain = 0, free = 0;
    Object.keys(dm).forEach(function (k) { if (k >= cut) { if (dm[k] > 0) pain++; else free++; } });
    var nights = cur.filter(function (l) { return l.wokeAtNight; }).length;
    var acts = A.data.activities.filter(function (a) { return a.date >= cut; });
    var mins = acts.reduce(function (s, a) { return s + (a.durationMin || 0); }, 0);
    return [
      { v: a1 == null ? "–" : a1.toFixed(1) + "<small>/10</small>", l: "Intensidad media", s: trend },
      { v: pain + "<small> días</small>", l: "Con dolor registrado", s: free ? free + " días registrados sin dolor" : "" },
      { v: nights + "<small> " + (nights === 1 ? "noche" : "noches") + "</small>", l: "Te despertó el dolor", s: "" },
      { v: acts.length + "<small> sesiones</small>", l: "Actividad", s: mins ? mins + " min en total" : "" }
    ];
  }

  function heatmap() {
    var weeks = 16, dm = dailyMax(), today = A.daysAgo(0);
    var start = A.daysAgo(weeks * 7 - 1);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    var cells = "", d = new Date(start);
    while (d <= today) {
      var iso = A.iso(d), v = dm[iso];
      cells += '<div data-day="' + iso + '" style="background:' + (v == null ? "var(--surface-2)" : v === 0 ? "var(--accent-soft)" : A.painColor(v)) + '" aria-label="' + iso + '"></div>';
      d.setDate(d.getDate() + 1);
    }
    return '<div class="heat-wrap"><div class="heat-days"><span>L</span><span></span><span>X</span><span></span><span>V</span><span></span><span>D</span></div>' +
      '<div class="heat" id="heat">' + cells + '</div></div>' +
      '<div class="legend" style="justify-content:flex-start;margin-top:10px;"><span><i style="background:var(--surface-2)"></i>Sin registro</span><span><i style="background:var(--accent-soft)"></i>Sin dolor</span><span><i style="background:var(--mild)"></i>Leve</span><span><i style="background:var(--mod)"></i>Moderado</span><span><i style="background:var(--severe)"></i>Intenso</span></div>';
  }

  function lineChart() {
    var dm = dailyMax(), n = range, pts = [], wake = {};
    A.data.logs.forEach(function (l) { if (l.wokeAtNight) wake[l.date] = true; });
    for (var i = n - 1; i >= 0; i--) { var iso = A.iso(A.daysAgo(i)); pts.push({ iso: iso, v: dm[iso] }); }
    if (!pts.some(function (p) { return p.v != null; })) return '<div class="empty">Registra tu dolor unos días para ver la evolución.</div>';
    var W = 320, H = 150, L = 22, R = 8, T = 12, B = 22, iw = W - L - R, ih = H - T - B;
    var X = function (i) { return L + iw * (i / (n - 1)); }, Y = function (v) { return T + ih * (1 - v / 10); };
    var grid = "";
    [0, 5, 10].forEach(function (v) {
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (L - 6) + '" y="' + (Y(v) + 3) + '" font-size="8" text-anchor="end">' + v + '</text>';
    });
    [0, Math.floor((n - 1) / 2), n - 1].forEach(function (i) {
      grid += '<text x="' + X(i) + '" y="' + (H - 6) + '" font-size="8" text-anchor="' + (i === 0 ? "start" : i === n - 1 ? "end" : "middle") + '">' + A.fmtShort(pts[i].iso) + '</text>';
    });
    // media móvil 7 días
    var ma = "", area = "", line = "", first = null, lastX = null, dots = "", hits = "";
    pts.forEach(function (p, i) {
      var win = pts.slice(Math.max(0, i - 6), i + 1).filter(function (q) { return q.v != null; }).map(function (q) { return q.v; });
      if (win.length) ma += (ma ? " L" : "M") + X(i).toFixed(1) + " " + Y(avg(win)).toFixed(1);
      if (p.v == null) return;
      var x = X(i).toFixed(1), y = Y(p.v).toFixed(1);
      line += (line ? " L" : "M") + x + " " + y;
      if (first == null) first = x; lastX = x;
      dots += '<circle cx="' + x + '" cy="' + y + '" r="' + (i === n - 1 || wake[p.iso] ? 3.2 : 2) + '" fill="' + (wake[p.iso] ? "var(--severe)" : "var(--accent)") + '" stroke="var(--surface)" stroke-width="1.5"/>';
      hits += '<rect data-pt="' + i + '" data-v="' + p.v + '" data-iso="' + p.iso + '" x="' + (X(i) - iw / n / 2) + '" y="' + T + '" width="' + iw / n + '" height="' + ih + '" fill="transparent" style="cursor:pointer"/>';
    });
    area = line + " L" + lastX + " " + Y(0) + " L" + first + " " + Y(0) + "Z";
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" id="lineChart">' + grid +
      '<path d="' + area + '" fill="var(--accent)" opacity=".08"/>' +
      '<path d="' + ma + '" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '<path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      dots + hits + '</svg>' +
      '<div class="legend" style="justify-content:flex-start;margin-top:6px;"><span><i style="background:var(--accent)"></i>Máximo del día</span><span><i style="background:var(--muted)"></i>Media 7 días</span><span><i style="background:var(--severe)"></i>Te despertó</span></div>';
  }

  function bars(rows, base) {
    if (!rows.length) return '<div class="empty">Aún no hay datos suficientes.</div>';
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }).concat(base ? [base.v] : []));
    return rows.concat(base ? [base] : []).map(function (r) {
      return '<div class="hbar"><span class="k">' + A.esc(r.k) + '</span><span class="tr"><span class="fl' + (r.base ? " base" : "") + '" style="width:' + Math.max(4, r.v / max * 100) + '%;display:block;' + (r.color ? "background:" + r.color : "") + '"></span></span><span class="v">' + (r.fmt || r.v) + '</span></div>';
    }).join("");
  }

  function zoneRows() {
    var cut = A.iso(A.daysAgo(range - 1));
    return A.ZONES.map(function (z) {
      var ls = A.data.logs.filter(function (l) { return l.date >= cut && l.zones.indexOf(z.id) !== -1; });
      return { k: z.label, v: ls.length, a: avg(ls.map(function (l) { return l.intensity; })) };
    }).filter(function (r) { return r.v; }).sort(function (a, b) { return b.v - a.v; }).map(function (r) {
      return { k: r.k, v: r.v, color: A.painColor(Math.round(r.a)) };
    });
  }
  function triggerRows() {
    var c = {}, cut = A.iso(A.daysAgo(range - 1));
    A.data.logs.forEach(function (l) { if (l.date >= cut) (l.triggers || []).forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return Object.keys(c).map(function (k) { return { k: k, v: c[k] }; }).sort(function (a, b) { return b.v - a.v; });
  }
  function activityRows() {
    // media de dolor el día siguiente a cada tipo de actividad
    var byDay = {};
    A.data.logs.forEach(function (l) { (byDay[l.date] = byDay[l.date] || []).push(l.intensity); });
    var all = avg(A.data.logs.map(function (l) { return l.intensity; }));
    var types = {};
    A.data.activities.forEach(function (a) {
      var nd = A.parse(a.date); nd.setDate(nd.getDate() + 1);
      var vals = (byDay[A.iso(nd)] || []);
      if (vals.length) (types[a.type] = types[a.type] || []).push(avg(vals));
    });
    var rows = Object.keys(types).map(function (k) { var v = avg(types[k]); return { k: A.ACT[k] || k, v: v, fmt: v.toFixed(1) }; })
      .sort(function (a, b) { return a.v - b.v; });
    return { rows: rows, base: all == null ? null : { k: "Tu media general", v: all, fmt: all.toFixed(1), base: true } };
  }

  A.renderProgress = function () {
    var v = document.getElementById("view-progress");
    var act = activityRows();
    v.innerHTML =
      '<div class="section-head"><div><div class="eyebrow">Progreso</div><h2>Cómo evoluciona tu espalda</h2></div></div>' +
      '<div class="seg" id="prRange">' + [[7, "7 días"], [30, "30 días"], [90, "90 días"]].map(function (r) {
        return '<button data-r="' + r[0] + '" class="' + (r[0] === range ? "on" : "") + '">' + r[1] + '</button>'; }).join("") + '</div>' +
      '<div class="stat-grid">' + tiles().map(function (t) {
        return '<div class="metric"><div class="v">' + t.v + '</div><div class="l">' + A.esc(t.l) + '</div>' + (t.s ? '<div class="l muted" style="margin-top:4px;">' + A.esc(t.s) + '</div>' : "") + '</div>';
      }).join("") + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Evolución del dolor</h3><p>Intensidad máxima de cada día</p></div></div>' + lineChart() + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Calendario</h3><p>Últimas 16 semanas · toca un día</p></div></div>' + heatmap() + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Zonas más afectadas</h3><p>Veces registrada · color según intensidad media</p></div></div>' + bars(zoneRows()) + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Posibles desencadenantes</h3><p>Lo que marcaste al registrar el dolor</p></div></div>' + bars(triggerRows()) + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Actividad y dolor al día siguiente</h3><p>Dolor medio el día después de cada actividad. Menos es mejor.</p></div></div>' +
        (act.rows.length ? bars(act.rows, act.base) : '<div class="empty">Registra actividad y dolor en días seguidos para ver qué te sienta mejor.</div>') + '</div>' +
      '<div class="card"><div class="card-head"><div><h3>Copia de seguridad</h3><p>Tus datos solo están en este móvil. Copia el código y guárdalo en Notas para no perderlos.</p></div></div>' +
        '<div class="btn-row"><button class="btn" id="bkCopy">Copiar datos</button><button class="btn" id="bkImport">Restaurar</button></div>' +
        '<div id="bkArea" hidden style="margin-top:10px;"><textarea id="bkText" rows="4" placeholder="Pega aquí el código de tu copia"></textarea><button class="btn primary block" id="bkDo" style="margin-top:8px;">Restaurar datos</button></div></div>';

    v.querySelector("#prRange").onclick = function (ev) { var b = ev.target.closest("[data-r]"); if (b) { range = +b.getAttribute("data-r"); A.renderProgress(); } };
    var heat = v.querySelector("#heat");
    heat.onclick = function (ev) {
      var c = ev.target.closest("[data-day]"); if (!c) return;
      var iso = c.getAttribute("data-day"), ls = A.data.logs.filter(function (l) { return l.date === iso; });
      A.tip(c, A.esc(A.fmtShort(iso)) + " · " + (ls.length ? "máx. " + Math.max.apply(null, ls.map(function (l) { return l.intensity; })) + "/10" : "sin registro"));
    };
    heat.scrollLeft = heat.scrollWidth;
    var lc = v.querySelector("#lineChart");
    if (lc) lc.onclick = function (ev) {
      var r = ev.target.closest("[data-pt]"); if (!r) return;
      A.tip(r, A.esc(A.fmtShort(r.getAttribute("data-iso"))) + " · " + r.getAttribute("data-v") + "/10");
    };
    v.querySelector("#bkCopy").onclick = function () {
      var txt = JSON.stringify(A.data);
      try {
        navigator.clipboard.writeText(txt).then(function () { A.toast("Datos copiados"); }, fallback);
      } catch (e) { fallback(); }
      function fallback() {
        v.querySelector("#bkArea").hidden = false;
        var ta = v.querySelector("#bkText"); ta.value = txt; ta.select(); A.toast("Selecciona y copia el texto");
      }
    };
    v.querySelector("#bkImport").onclick = function () { v.querySelector("#bkArea").hidden = false; v.querySelector("#bkText").value = ""; v.querySelector("#bkText").focus(); };
    v.querySelector("#bkDo").onclick = function () {
      try {
        var d = JSON.parse(v.querySelector("#bkText").value);
        if (!d || !Array.isArray(d.logs)) throw 0;
        A.data.logs = d.logs; A.data.activities = d.activities || []; A.data.routines = d.routines || [];
        A.save(); A.renderAll(); A.toast("Datos restaurados");
      } catch (e) { A.toast("El código no es válido"); }
    };
  };
})(window.App);
