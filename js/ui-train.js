/* Mi Espalda — pestañas Gimnasio y Estiramientos */
(function (A) {
  "use strict";

  var ui = {
    gym: { count: 6, focus: "equilibrada", soft: false, cooldown: true, filter: "todos", preview: null },
    stretch: { count: 5, filter: "todos", preview: null }
  };

  function thumbs(r) {
    return '<div class="thumbs">' + r.items.map(function (it) {
      var e = A.exById(it.ex); return e ? '<div class="t" title="' + A.esc(e.name) + '">' + A.figure(e, { animate: false }) + '</div>' : "";
    }).join("") + '</div>';
  }

  function routineCard(r, primary) {
    return '<div class="card routine-card">' +
      '<div class="routine-top"><div><h3>' + A.esc(r.name) + '</h3><p>' + A.esc(r.desc || "Rutina personalizada") + '</p></div>' +
      '<span class="num ink2" style="font-size:13px;white-space:nowrap;">≈ ' + A.estimateMin(r) + ' min</span></div>' +
      thumbs(r) +
      '<div class="btn-row">' +
        '<button class="btn ' + (primary ? "primary" : "soft") + '" data-start="' + r.id + '">' + A.icon("play") + ' Empezar</button>' +
        '<button class="btn" data-open="' + r.id + '">Ver rutina</button>' +
      '</div></div>';
  }

  function libraryHtml(kind) {
    var st = ui[kind], list = kind === "gym" ? A.GYM : A.STRETCH, chips;
    if (kind === "gym") {
      chips = [["todos", "Todos"]].concat(Object.keys(A.GROUPS).map(function (k) { return [k, A.GROUPS[k]]; }));
      list = st.filter === "todos" ? list : list.filter(function (e) { return e.group === st.filter; });
    } else {
      var areas = [];
      A.STRETCH.forEach(function (e) { if (areas.indexOf(e.area) === -1) areas.push(e.area); });
      chips = [["todos", "Todos"]].concat(areas.map(function (a) { return [a, a]; }));
      list = st.filter === "todos" ? list : list.filter(function (e) { return e.area === st.filter; });
    }
    return '<div class="chips" data-filter-row="' + kind + '" style="flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;">' +
      chips.map(function (c) { return '<button class="chip' + (st.filter === c[0] ? " on" : "") + '" data-filter="' + A.esc(c[0]) + '" style="flex-shrink:0">' + A.esc(c[1]) + '</button>'; }).join("") + '</div>' +
      '<div class="ex-grid" style="margin-top:10px;">' + list.map(function (e) {
        return '<button class="ex-card" data-ex="' + e.id + '"><div class="pic">' + A.figure(e) + '</div><div class="meta"><b>' + A.esc(e.name) + '</b><span>' +
          A.esc(kind === "gym" ? e.equip : e.area + " · " + e.hold + " s") + '</span></div></button>';
      }).join("") + '</div>';
  }

  function generatorHtml(kind) {
    var st = ui[kind];
    var opts;
    if (kind === "gym") {
      opts =
        '<div class="field" style="margin-bottom:12px;"><span class="label">Duración</span><div class="seg" data-opt="count">' +
          [[4, "Corta · 4"], [6, "Media · 6"], [8, "Larga · 8"]].map(function (o) { return '<button data-v="' + o[0] + '" class="' + (st.count === o[0] ? "on" : "") + '">' + o[1] + '</button>'; }).join("") + '</div></div>' +
        '<div class="field" style="margin-bottom:12px;"><span class="label">Enfoque</span><div class="seg" data-opt="focus">' +
          [["equilibrada", "Equilibrada"], ["espalda", "Espalda"], ["core", "Core"]].map(function (o) { return '<button data-v="' + o[0] + '" class="' + (st.focus === o[0] ? "on" : "") + '">' + o[1] + '</button>'; }).join("") + '</div></div>' +
        '<div class="switch-row" style="margin-bottom:10px;"><span style="font-size:14px;">Modo suave <span class="muted">(día con molestias)</span></span><button class="switch' + (st.soft ? " on" : "") + '" data-toggle="soft" role="switch" aria-checked="' + st.soft + '"></button></div>' +
        '<div class="switch-row" style="margin-bottom:14px;"><span style="font-size:14px;">Estiramientos al final</span><button class="switch' + (st.cooldown ? " on" : "") + '" data-toggle="cooldown" role="switch" aria-checked="' + st.cooldown + '"></button></div>';
    } else {
      opts = '<div class="field" style="margin-bottom:14px;"><span class="label">Número de estiramientos</span><div class="seg" data-opt="count">' +
        [[3, "3"], [5, "5"], [7, "7"]].map(function (o) { return '<button data-v="' + o[0] + '" class="' + (st.count === o[0] ? "on" : "") + '">' + o[1] + '</button>'; }).join("") + '</div></div>';
    }
    return '<div class="card"><div class="card-head"><div><h3>Rutina aleatoria</h3><p>' +
      (kind === "gym" ? "Combina máquinas y posiciones que protegen la espalda" : "Una sesión distinta cada vez") + '</p></div></div>' +
      opts + '<button class="btn primary block" data-gen="' + kind + '">' + A.icon("shuffle") + ' Generar rutina</button>' +
      (st.preview ? '<div style="margin-top:14px;">' + previewHtml(st.preview) + '</div>' : "") + '</div>';
  }

  function previewHtml(r) {
    return '<div class="routine-top" style="margin-bottom:6px;"><div><div class="eyebrow">Tu rutina</div><h3 style="font-size:16px;">' + A.esc(r.name) + '</h3></div>' +
      '<span class="num ink2" style="font-size:13px;">≈ ' + A.estimateMin(r) + ' min</span></div>' +
      r.items.map(function (it) {
        var e = A.exById(it.ex);
        return '<div class="plan-row"><div class="t">' + A.figure(e, { animate: false }) + '</div><div class="info"><b>' + A.esc(e.name) + '</b><span>' + A.esc(A.itemSummary(it)) + '</span></div></div>';
      }).join("") +
      '<div class="btn-row" style="margin-top:10px;"><button class="btn primary" data-start="' + r.id + '">' + A.icon("play") + ' Empezar</button>' +
      '<button class="btn" data-edit="' + r.id + '">' + A.icon("edit") + ' Personalizar</button></div>';
  }

  A.renderTrain = function (kind) {
    var v = document.getElementById(kind === "gym" ? "view-gym" : "view-stretch");
    var mine = A.data.routines.filter(function (r) { return r.kind === kind; });
    var presets = A.PRESETS.filter(function (r) { return r.kind === kind; });
    v.innerHTML =
      '<div class="section-head"><div><div class="eyebrow">' + (kind === "gym" ? "Gimnasio" : "Movilidad") + '</div><h2>' +
        (kind === "gym" ? "Entrena tu espalda" : "Estiramientos de espalda") + '</h2></div></div>' +
      generatorHtml(kind) +
      '<div class="section-head"><h2 style="font-size:17px;">Mis rutinas</h2><button class="link-btn" data-new="' + kind + '">+ Crear rutina</button></div>' +
      (mine.length ? mine.map(function (r) { return routineCard(r, false); }).join("") :
        '<div class="card empty" style="padding:18px;">Crea tu propia rutina eligiendo ejercicios, series, repeticiones y descansos.</div>') +
      '<div class="section-head"><h2 style="font-size:17px;">Recomendadas</h2></div>' +
      presets.map(function (r) { return routineCard(r, false); }).join("") +
      '<div class="section-head"><h2 style="font-size:17px;">' + (kind === "gym" ? "Ejercicios y máquinas" : "Todos los estiramientos") + '</h2></div>' +
      libraryHtml(kind);
  };

  /* ---------- eventos (delegados) ---------- */
  document.addEventListener("click", function (ev) {
    var view = ev.target.closest("#view-gym, #view-stretch, .sheet");
    if (!view) return;
    var kindOf = function () { return view.id === "view-stretch" ? "stretch" : "gym"; };
    var t;
    if ((t = ev.target.closest("[data-start]"))) {
      var r = findRoutine(t.getAttribute("data-start")); if (r) { A.closeSheet(); A.startRoutine(r); } return;
    }
    if ((t = ev.target.closest("[data-open]"))) { openRoutine(findRoutine(t.getAttribute("data-open"))); return; }
    if ((t = ev.target.closest("[data-edit]"))) { var src = findRoutine(t.getAttribute("data-edit")); A.closeSheet(); openEditor(src, !src.random && !isPreset(src)); return; }
    if ((t = ev.target.closest("[data-new]"))) { var k = t.getAttribute("data-new"); openEditor({ kind: k, name: k === "gym" ? "Mi rutina de gimnasio" : "Mis estiramientos", items: [] }, false); return; }
    if ((t = ev.target.closest("[data-ex]"))) { if (!view.classList.contains("sheet")) openExercise(A.exById(t.getAttribute("data-ex"))); return; }
    if ((t = ev.target.closest("[data-gen]"))) {
      var gk = t.getAttribute("data-gen");
      ui[gk].preview = gk === "gym" ? A.randomGym(ui.gym) : A.randomStretch(ui.stretch.count);
      A.renderTrain(gk); return;
    }
    if ((t = ev.target.closest("[data-opt] [data-v]"))) {
      var opt = t.parentNode.getAttribute("data-opt"), val = t.getAttribute("data-v");
      ui[kindOf()][opt] = opt === "count" ? +val : val; A.renderTrain(kindOf()); return;
    }
    if ((t = ev.target.closest("[data-toggle]"))) { var key = t.getAttribute("data-toggle"); ui.gym[key] = !ui.gym[key]; A.renderTrain("gym"); return; }
    if ((t = ev.target.closest("[data-filter]")) && !view.classList.contains("sheet")) { ui[kindOf()].filter = t.getAttribute("data-filter"); A.renderTrain(kindOf()); }
  });

  function isPreset(r) { return A.PRESETS.indexOf(r) !== -1; }
  function findRoutine(id) {
    return A.routineById(id) || (ui.gym.preview && ui.gym.preview.id === id ? ui.gym.preview : null) ||
      (ui.stretch.preview && ui.stretch.preview.id === id ? ui.stretch.preview : null);
  }

  /* ---------- detalle de ejercicio ---------- */
  function openExercise(e) {
    var kv = e.kind === "gym"
      ? '<div><b>' + e.sets + '</b><span>series</span></div><div><b>' + (e.secs ? e.secs + " s" : e.reps) + '</b><span>' + (e.secs ? "tiempo" : "repeticiones") + '</span></div><div><b>' + e.rest + ' s</b><span>descanso</span></div>'
      : '<div><b>' + e.hold + ' s</b><span>mantener</span></div><div><b>' + e.reps + '</b><span>repeticiones</span></div><div><b>' + (e.sides === 2 ? "2" : "1") + '</b><span>' + (e.sides === 2 ? "lados" : "lado") + '</span></div>';
    var body =
      '<div class="ex-hero">' + A.figure(e) + '</div>' +
      '<p class="ink2" style="margin:12px 0;">' + A.esc(e.kind === "gym" ? e.equip + " · " + e.muscles : "Zona: " + e.area) + '</p>' +
      '<div class="kv" style="margin-bottom:16px;">' + kv + '</div>' +
      '<div class="eyebrow" style="margin-bottom:8px;">Cómo hacerlo</div><ol class="cue-list">' + e.cues.map(function (c) { return "<li>" + A.esc(c) + "</li>"; }).join("") + '</ol>' +
      (e.caution ? '<div class="caution" style="margin-top:14px;">' + A.esc(e.caution) + '</div>' : "");
    var single = { id: "one-" + e.id, kind: e.kind, name: e.name, items: [A.itemFor(e.id)], random: true };
    ui[e.kind].single = single;
    A.openSheet(e.name, body, '<button class="btn primary block" id="exTry">' + A.icon("play") + ' Hacer este ejercicio</button>', function (sh) {
      sh.querySelector("#exTry").onclick = function () { A.closeSheet(); A.startRoutine(single); };
    });
  }

  /* ---------- ver rutina ---------- */
  function openRoutine(r) {
    if (!r) return;
    var custom = !isPreset(r) && !r.random;
    var body = '<p class="ink2" style="margin:0 0 10px;">' + A.esc(r.desc || "Rutina personalizada") + ' · ≈ ' + A.estimateMin(r) + ' min</p>' +
      r.items.map(function (it) {
        var e = A.exById(it.ex);
        return '<div class="plan-row"><div class="t">' + A.figure(e) + '</div><div class="info"><b>' + A.esc(e.name) + '</b><span>' + A.esc(A.itemSummary(it)) + '</span></div></div>';
      }).join("") +
      (custom ? '<button class="btn danger block" id="rtDel" style="margin-top:14px;">' + A.icon("trash") + ' Borrar rutina</button>' : "");
    var foot = '<div class="btn-row"><button class="btn primary" data-start="' + r.id + '">' + A.icon("play") + ' Empezar</button>' +
      '<button class="btn" data-edit="' + r.id + '">' + A.icon("edit") + (custom ? " Editar" : " Personalizar") + '</button></div>';
    A.openSheet(r.name, body, foot, function (sh) {
      var d = sh.querySelector("#rtDel");
      if (d) d.onclick = function () {
        if (d.getAttribute("data-sure")) {
          A.data.routines = A.data.routines.filter(function (x) { return x.id !== r.id; });
          A.save(); A.closeSheet(); A.renderTrain(r.kind); A.toast("Rutina borrada");
        } else { d.setAttribute("data-sure", "1"); d.lastChild.textContent = " Toca otra vez para borrar"; }
      };
    });
  }

  /* ---------- editor ---------- */
  function openEditor(src, overwrite) {
    var st = {
      id: overwrite ? src.id : null, kind: src.kind,
      name: overwrite ? src.name : (src.random || isPreset(src) ? src.name + " (mía)" : src.name),
      items: src.items.map(function (it) { return JSON.parse(JSON.stringify(it)); })
    };
    drawEditor(st);
  }

  function stepper(i, field, val, unit) {
    return '<div class="stepper"><button data-st="' + i + '|' + field + '|-1" aria-label="Menos">−</button><span>' + val + (unit || "") + '</span><button data-st="' + i + '|' + field + '|1" aria-label="Más">+</button></div>';
  }
  var LIMITS = { sets: [1, 8, 1], reps: [1, 30, 1], secs: [10, 180, 5], rest: [0, 240, 15], hold: [10, 120, 5] };

  function drawEditor(st) {
    var rows = st.items.map(function (it, i) {
      var e = A.exById(it.ex), ctr;
      if (e.kind === "gym") {
        ctr = '<div class="mini-row">Series ' + stepper(i, "sets", it.sets) + '</div>' +
          '<div class="mini-row">' + (it.secs ? "Tiempo " + stepper(i, "secs", it.secs, "s") : "Reps " + stepper(i, "reps", it.reps)) + '</div>' +
          '<div class="mini-row">Descanso ' + stepper(i, "rest", it.rest, "s") + '</div>';
      } else {
        ctr = '<div class="mini-row">Mantener ' + stepper(i, "hold", it.hold, "s") + '</div>' +
          '<div class="mini-row">Veces ' + stepper(i, "reps", it.reps) + '</div>';
      }
      return '<div class="plan-row" style="align-items:flex-start;"><div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;">' +
        '<div style="display:flex;gap:10px;align-items:center;"><div class="t">' + A.figure(e, { animate: false }) + '</div><div class="info"><b>' + A.esc(e.name) + '</b>' +
        '<span>' + A.esc(e.kind === "gym" ? e.equip : e.area) + '</span></div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;">' + ctr + '</div></div>' +
        '<div class="ctrls"><button class="tiny-btn" data-mv="' + i + '|-1" aria-label="Subir">' + A.icon("up") + '</button>' +
        '<button class="tiny-btn" data-mv="' + i + '|1" aria-label="Bajar">' + A.icon("down") + '</button>' +
        '<button class="tiny-btn" data-rm="' + i + '" aria-label="Quitar">' + A.icon("trash") + '</button></div></div>';
    }).join("");
    var body =
      '<div class="field"><label for="edName">Nombre</label><input type="text" id="edName" value="' + A.esc(st.name) + '"></div>' +
      '<div class="switch-row" style="margin-bottom:6px;"><span class="label" style="font-size:13px;font-weight:600;color:var(--ink-2);">Ejercicios · ' + st.items.length + '</span>' +
      (st.items.length ? '<span class="num ink2" style="font-size:13px;">≈ ' + A.estimateMin(st) + ' min</span>' : "") + '</div>' +
      (rows || '<div class="empty">Añade ejercicios para montar tu rutina.</div>') +
      '<button class="btn soft block" id="edAdd" style="margin-top:12px;">' + A.icon("plus") + ' Añadir ejercicio</button>';
    var foot = '<div class="btn-row"><button class="btn" id="edPlay">' + A.icon("play") + ' Probar</button><button class="btn primary" id="edSave">Guardar rutina</button></div>';
    var sh = A.openSheet(st.id ? "Editar rutina" : "Nueva rutina", body, foot);
    var scroll = st._scroll || 0; sh.scrollTop = scroll;

    sh.querySelector("#edName").oninput = function () { st.name = this.value; };
    sh.querySelector(".sheet-body").onclick = function (ev) {
      var b;
      if ((b = ev.target.closest("[data-st]"))) {
        var p = b.getAttribute("data-st").split("|"), it = st.items[+p[0]], f = p[1], L = LIMITS[f];
        it[f] = Math.max(L[0], Math.min(L[1], it[f] + L[2] * +p[2]));
        st._scroll = sh.scrollTop; drawEditor(st); return;
      }
      if ((b = ev.target.closest("[data-mv]"))) {
        var q = b.getAttribute("data-mv").split("|"), i = +q[0], j = i + +q[1];
        if (j < 0 || j >= st.items.length) return;
        var tmp = st.items[i]; st.items[i] = st.items[j]; st.items[j] = tmp;
        st._scroll = sh.scrollTop; drawEditor(st); return;
      }
      if ((b = ev.target.closest("[data-rm]"))) { st.items.splice(+b.getAttribute("data-rm"), 1); st._scroll = sh.scrollTop; drawEditor(st); return; }
      if (ev.target.closest("#edAdd")) openPicker(st);
    };
    sh.querySelector("#edPlay").onclick = function () {
      if (!st.items.length) { A.toast("Añade al menos un ejercicio"); return; }
      var r = { id: "tmp", kind: st.kind, name: st.name || "Mi rutina", items: st.items, random: true };
      A.closeSheet(); A.startRoutine(r);
    };
    sh.querySelector("#edSave").onclick = function () {
      if (!st.items.length) { A.toast("Añade al menos un ejercicio"); return; }
      var rec = { id: st.id || "u-" + A.uid(), kind: st.kind, name: (st.name || "Mi rutina").trim(), desc: "Rutina personalizada", items: st.items };
      var k = -1;
      A.data.routines.forEach(function (r, idx) { if (r.id === rec.id) k = idx; });
      if (k === -1) A.data.routines.unshift(rec); else A.data.routines[k] = rec;
      A.save(); A.closeSheet(); A.renderTrain(st.kind); A.go(st.kind === "gym" ? "gym" : "stretch"); A.toast("Rutina guardada");
    };
  }

  function openPicker(st) {
    var groups = st.kind === "gym" ? Object.keys(A.GROUPS) : null;
    var list = st.kind === "gym" ? A.GYM.concat(A.STRETCH) : A.STRETCH;
    var html = (groups ? groups.map(function (g) {
      return '<div class="eyebrow" style="margin:12px 0 4px;">' + A.esc(A.GROUPS[g]) + '</div>' +
        A.GYM.filter(function (e) { return e.group === g; }).map(row).join("");
    }).join("") + '<div class="eyebrow" style="margin:12px 0 4px;">Estiramientos</div>' + A.STRETCH.map(row).join("") : list.map(row).join(""));
    function row(e) {
      var inR = st.items.some(function (it) { return it.ex === e.id; });
      return '<button class="plan-row" data-pick="' + e.id + '" style="width:100%;background:none;border:none;border-top:1px solid var(--line);text-align:left;cursor:pointer;">' +
        '<div class="t">' + A.figure(e, { animate: false }) + '</div><div class="info"><b>' + A.esc(e.name) + '</b><span>' +
        A.esc(e.kind === "gym" ? e.equip : e.area) + '</span></div>' + (inR ? '<span class="chip static">Añadido</span>' : '<span class="tiny-btn">' + A.icon("plus") + '</span>') + '</button>';
    }
    var sh = A.openSheet("Añadir ejercicio", html, '<button class="btn primary block" id="pkDone">Listo</button>');
    sh.querySelector(".sheet-body").onclick = function (ev) {
      var b = ev.target.closest("[data-pick]"); if (!b) return;
      st.items.push(A.itemFor(b.getAttribute("data-pick")));
      b.querySelector(".tiny-btn, .chip").outerHTML = '<span class="chip static">Añadido</span>';
      A.toast("Añadido");
    };
    sh.querySelector("#pkDone").onclick = function () { st._scroll = 99999; drawEditor(st); };
  }
})(window.App);
