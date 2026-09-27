/* Mi Espalda — reproductor de rutinas con temporizadores y descansos */
(function (A) {
  "use strict";

  var P = null;         // estado del reproductor
  var audioCtx = null, wakeLock = null;
  var soundOn = true;
  try { soundOn = localStorage.getItem("espalda_sound") !== "0"; } catch (e) {}

  function beep(freq, len) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), gn = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = freq || 880;
      gn.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.02);
      gn.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (len || 0.18));
      o.connect(gn); gn.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + (len || 0.18) + 0.05);
    } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) {}
  }
  function lockScreen() {
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }).catch(function () {}); } catch (e) {}
  }

  A.startRoutine = function (routine) {
    var steps = A.buildSteps(routine);
    if (!steps.length) { A.toast("La rutina no tiene ejercicios"); return; }
    P = { routine: routine, steps: steps, i: 0, started: Date.now(), paused: false, stepStart: Date.now(),
          pausedAt: 0, extra: 0, done: 0, lastBeep: -1, timer: null };
    beep(660, 0.05); // desbloquea el audio en iOS
    lockScreen();
    var el = document.createElement("div");
    el.className = "player"; el.id = "player";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Rutina en curso");
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    renderStep();
    P.timer = setInterval(tick, 250);
  };

  function close() {
    if (P && P.timer) clearInterval(P.timer);
    P = null;
    var el = document.getElementById("player"); if (el) el.remove();
    document.body.style.overflow = "";
    try { if (wakeLock) wakeLock.release(); } catch (e) {}
    wakeLock = null;
  }

  function cur() { return P.steps[P.i]; }
  function elapsed() {
    var now = P.paused ? P.pausedAt : Date.now();
    return (now - P.stepStart) / 1000;
  }
  function remaining() { var s = cur(); return s.secs + P.extra - elapsed(); }

  function go(i) {
    if (i >= P.steps.length) { finish(); return; }
    if (i < 0) i = 0;
    P.i = i; P.stepStart = Date.now(); P.extra = 0; P.lastBeep = -1;
    if (P.paused) P.pausedAt = Date.now();
    renderStep();
  }

  function tick() {
    if (!P || P.paused) return;
    var s = cur();
    if (s.secs) {
      var r = Math.ceil(remaining());
      if (r <= 3 && r > 0 && r !== P.lastBeep) { P.lastBeep = r; beep(740, 0.1); }
      if (remaining() <= 0) {
        beep(s.type === "rest" ? 988 : 523, 0.35);
        if (s.type === "work") P.done++;
        go(P.i + 1);
        return;
      }
    }
    updateClock();
  }

  function ringSvg(frac) {
    var r = 46, c = 2 * Math.PI * r;
    return '<svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="8"/>' +
      '<circle id="ringArc" cx="54" cy="54" r="' + r + '" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - frac)).toFixed(1) + '"/></svg>';
  }

  function updateClock() {
    var s = cur(), v = document.getElementById("clockVal"), arc = document.getElementById("ringArc");
    if (!v) return;
    if (s.secs) {
      var rem = Math.max(0, remaining()), tot = s.secs + P.extra;
      v.textContent = A.fmtTime(Math.ceil(rem));
      if (arc) { var c = 2 * Math.PI * 46; arc.setAttribute("stroke-dashoffset", (c * (1 - rem / tot)).toFixed(1)); }
    } else {
      v.textContent = A.fmtTime(elapsed());
    }
    var tt = document.getElementById("totalTime");
    if (tt) tt.textContent = A.fmtTime((Date.now() - P.started) / 1000);
  }

  function nextWork(from) {
    for (var j = from; j < P.steps.length; j++) if (P.steps[j].type === "work") return P.steps[j];
    return null;
  }

  function renderStep() {
    var el = document.getElementById("player"); if (!el) return;
    var s = cur(), rest = s.type === "rest";
    var shown = rest ? (nextWork(P.i + 1) || s) : s;
    var ex = shown.ex, it = shown.it;
    var workTotal = P.steps.filter(function (x) { return x.type === "work"; }).length;
    var workIdx = P.steps.slice(0, P.i + 1).filter(function (x) { return x.type === "work"; }).length;
    var pct = Math.round((workIdx - (rest ? 0 : 1)) / workTotal * 100);
    var after = null;
    if (!rest) for (var j = P.i + 1; j < P.steps.length; j++) {
      if (P.steps[j].type === "work" && P.steps[j].idx !== s.idx) { after = P.steps[j]; break; }
    }

    var title, sub, clock;
    if (rest) {
      title = s.label || "Descanso";
      sub = "Siguiente: " + ex.name + (shown.side ? " · " + shown.side : "") + " · " +
        (ex.kind === "gym" ? "serie " + shown.set + " de " + shown.of : "");
      clock = '<div class="ring">' + ringSvg(1) + '<div class="val" id="clockVal">' + A.fmtTime(s.secs) + "</div></div>" +
        '<div><div class="ink2" style="font-size:13px;">Respira y suelta los hombros</div>' +
        '<div class="btn-row" style="margin-top:10px;"><button class="btn sm" data-p="plus">+15 s</button><button class="btn sm soft" data-p="skip">Saltar</button></div></div>';
    } else {
      title = ex.name;
      sub = (s.side ? s.side + " · " : "") + (ex.kind === "gym" ? ex.equip : ex.area);
      var dots = "";
      for (var d = 1; d <= s.of; d++) dots += '<i class="' + (d < s.set ? "done" : d === s.set ? "cur" : "") + '"></i>';
      if (s.secs) {
        clock = '<div class="ring">' + ringSvg(1) + '<div class="val" id="clockVal">' + A.fmtTime(s.secs) + "</div></div>" +
          '<div><div class="eyebrow">' + (ex.kind === "gym" ? "Serie " + s.set + " de " + s.of : "Repetición " + s.set + " de " + s.of) + '</div>' +
          '<div class="big-reps">' + s.secs + '<small> s</small></div><div class="set-dots">' + dots + "</div></div>";
      } else {
        clock = '<div><div class="eyebrow">Serie ' + s.set + " de " + s.of + '</div>' +
          '<div class="big-reps">' + s.reps + '<small> repeticiones</small></div>' +
          '<div class="set-dots">' + dots + '</div>' +
          '<div class="ink2" style="font-size:13px;margin-top:8px;">Tiempo en la serie <span class="num" id="clockVal">0:00</span>' +
          (ex.tempo ? " · ritmo " + ex.tempo : "") + "</div></div>";
      }
    }

    el.innerHTML =
      '<div class="player-inner">' +
        '<div class="player-top">' +
          '<button class="icon-btn" data-p="close" aria-label="Salir">' + A.icon("close") + '</button>' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="num ink2" id="totalTime" style="font-size:13px;min-width:40px;text-align:right;">0:00</span>' +
          '<button class="icon-btn" data-p="sound" aria-label="Sonido">' + A.icon(soundOn ? "sound" : "mute") + '</button>' +
        '</div>' +
        '<div class="player-stage">' +
          '<div class="player-pic"><span class="phase-tag' + (rest ? " rest" : "") + '">' + (rest ? "Descanso" : "Ahora") + '</span>' + A.figure(ex) + '</div>' +
          '<div><h2>' + A.esc(title) + '</h2><div class="sub">' + A.esc(sub) + '</div></div>' +
          '<div class="clock">' + clock + '</div>' +
          (!rest && ex.cues ? '<div class="ink2" style="font-size:13.5px;">' + A.esc(ex.cues[0]) + ". " + A.esc(ex.cues[1] || "") + '</div>' : "") +
          (after && !rest ? '<div class="next-up"><div class="t">' + A.figure(after.ex, { animate: false }) + '</div><div><div class="muted" style="font-size:11.5px;">DESPUÉS</div><b>' + A.esc(after.ex.name) + '</b></div></div>' : "") +
        '</div>' +
        '<div class="player-actions">' +
          '<button class="btn" data-p="prev" aria-label="Anterior">' + A.icon("prev") + '</button>' +
          (!rest && !s.secs
            ? '<button class="btn primary" data-p="done">' + A.icon("check") + ' Serie hecha</button>'
            : '<button class="btn primary" data-p="pause">' + A.icon(P.paused ? "play" : "pause") + (P.paused ? " Reanudar" : " Pausa") + '</button>') +
          '<button class="btn" data-p="next" aria-label="Siguiente">' + A.icon("next") + '</button>' +
        '</div>' +
      '</div>';
    updateClock();
  }

  function finish() {
    clearInterval(P.timer);
    var mins = Math.max(1, Math.round((Date.now() - P.started) / 60000));
    var r = P.routine, el = document.getElementById("player");
    P.finishedMin = mins;
    var scale = "";
    for (var v = 0; v <= 10; v++) scale += '<button data-fin="' + v + '" style="background:' + (v ? A.painColor(v) : "var(--surface)") + ';color:' + (v ? "#fff" : "var(--ink-2)") + ';border-color:transparent;opacity:.9">' + v + "</button>";
    beep(880, 0.2); setTimeout(function () { beep(1175, 0.3); }, 220);
    el.innerHTML =
      '<div class="player-inner" style="justify-content:center;gap:18px;">' +
        '<div class="eyebrow">Rutina completada</div>' +
        '<h2 style="font-size:28px;">' + A.esc(r.name) + '</h2>' +
        '<div class="today-grid">' +
          '<div class="metric"><div class="v">' + mins + ' <small>min</small></div><div class="l">Duración</div></div>' +
          '<div class="metric"><div class="v">' + P.done + ' <small>' + (r.kind === "gym" ? "series" : "estiramientos") + '</small></div><div class="l">Completadas</div></div>' +
        '</div>' +
        '<div class="card"><div class="card-head"><div><h3>¿Cómo está tu espalda ahora?</h3><p>Opcional. Sirve para ver qué rutinas te sientan mejor.</p></div></div>' +
        '<div class="scale" id="finScale">' + scale + '</div></div>' +
        '<button class="btn primary block" data-p="save">Guardar en mi historial</button>' +
        '<button class="btn ghost block" data-p="close">Salir sin guardar</button>' +
      '</div>';
    P.finPain = null;
  }

  function saveSession() {
    var r = P.routine, today = A.iso();
    A.data.activities.push({ id: A.uid(), date: today, type: r.kind === "gym" ? "gimnasio" : "estiramientos",
      durationMin: P.finishedMin, notes: r.name, routineId: r.id });
    if (P.finPain != null) {
      var h = new Date().getHours();
      A.data.logs.push({ id: A.uid(), date: today, moment: h < 13 ? "Mañana" : h < 20 ? "Tarde" : "Noche", zones: [],
        intensity: P.finPain, wokeAtNight: false, wokeTime: "", notes: "Tras " + r.name.toLowerCase(), after: r.id });
    }
    A.save();
    close();
    A.toast("Sesión guardada");
    if (A.renderAll) A.renderAll();
  }

  document.addEventListener("click", function (ev) {
    if (!P) return;
    var f = ev.target.closest("[data-fin]");
    if (f) {
      P.finPain = +f.getAttribute("data-fin");
      document.querySelectorAll("#finScale button").forEach(function (b) {
        b.style.outline = b === f ? "3px solid var(--ink)" : "none";
      });
      return;
    }
    var b = ev.target.closest("[data-p]"); if (!b) return;
    var a = b.getAttribute("data-p");
    if (a === "close") close();
    else if (a === "save") saveSession();
    else if (a === "sound") { soundOn = !soundOn; try { localStorage.setItem("espalda_sound", soundOn ? "1" : "0"); } catch (e) {} renderStep(); }
    else if (a === "done") { P.done++; beep(523, 0.12); go(P.i + 1); }
    else if (a === "next") { if (cur().type === "work") P.done++; go(P.i + 1); }
    else if (a === "prev") go(P.i - (cur().type === "rest" ? 1 : 2) < 0 ? 0 : P.i - (cur().type === "rest" ? 1 : 2));
    else if (a === "skip") go(P.i + 1);
    else if (a === "plus") { P.extra += 15; updateClock(); }
    else if (a === "pause") {
      if (P.paused) { P.stepStart += Date.now() - P.pausedAt; P.paused = false; }
      else { P.paused = true; P.pausedAt = Date.now(); }
      renderStep();
    }
  });
})(window.App);
