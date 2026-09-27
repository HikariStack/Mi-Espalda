/* Mi Espalda — rutinas predefinidas, generador aleatorio y estimaciones */
(function (A) {
  "use strict";

  function g(id, sets, n, rest) { // item de gimnasio
    var e = A.exById(id), it = { ex: id, sets: sets || e.sets, rest: rest || e.rest };
    if (e.secs) it.secs = n || e.secs; else it.reps = n || e.reps;
    return it;
  }
  function st(id, hold) { var e = A.exById(id); return { ex: id, hold: hold || e.hold, sides: e.sides, reps: e.reps }; }
  A.itemFor = function (id) { return A.exById(id).kind === "gym" ? g(id) : st(id); };

  A.PRESETS = [
    { id: "p-maquinas", kind: "gym", name: "Espalda fuerte en máquinas", desc: "Tirón y postura con máquinas guiadas",
      items: [g("jalon"), g("remo-pecho"), g("face-pull"), g("pallof"), g("puente"), g("plancha")] },
    { id: "p-core", kind: "gym", name: "Core antidolor lumbar", desc: "Estabilidad sin cargar la columna",
      items: [g("dead-bug"), g("bird-dog"), g("pallof"), g("puente"), g("plancha", 3, 25)] },
    { id: "p-full", kind: "gym", name: "Cuerpo completo espalda-segura", desc: "Piernas, tirón, empuje y carga",
      items: [g("prensa"), g("remo-polea"), g("press-pecho"), g("rumano"), g("pallof"), g("granjero")] },
    { id: "s-manana", kind: "stretch", name: "Al despertar", desc: "Quita la rigidez de la noche",
      items: [st("gato-camello"), st("rodillas-pecho"), st("torsion"), st("cobra"), st("nino")] },
    { id: "s-noche", kind: "stretch", name: "Antes de dormir", desc: "Relaja lumbar, glúteo y ciático",
      items: [st("rodillas-pecho"), st("piriforme"), st("isquios"), st("torsion"), st("nino", 60)] },
    { id: "s-post", kind: "stretch", name: "Después del gimnasio", desc: "Dorsal, cadera y descompresión",
      items: [st("dorsal-apoyo"), st("colgarse"), st("psoas"), st("isquios"), st("rot-toracica")] }
  ];

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var SLOTS = {
    equilibrada: ["tiron", "core", "bisagra", "piernas", "tiron", "core", "carga", "empuje"],
    espalda:     ["tiron", "carga", "tiron", "bisagra", "core", "tiron", "bisagra", "core"],
    core:        ["core", "bisagra", "core", "carga", "core", "bisagra", "tiron", "core"]
  };

  /* opts: {count:4|6|8, focus:"equilibrada"|"espalda"|"core", soft:bool, cooldown:bool} */
  A.randomGym = function (opts) {
    var used = {}, items = [];
    SLOTS[opts.focus || "equilibrada"].slice(0, opts.count).forEach(function (grp) {
      var pool = shuffle(A.GYM.filter(function (e) {
        return !used[e.id] && (!opts.soft || e.level === 1);
      }));
      var pick = pool.filter(function (e) { return e.group === grp; })[0] || pool[0];
      if (!pick) return;
      used[pick.id] = true;
      var it = g(pick.id);
      if (opts.soft) it.sets = 2;
      items.push(it);
    });
    if (opts.cooldown) shuffle(["dorsal-apoyo", "psoas", "isquios", "nino", "colgarse"]).slice(0, 2)
      .forEach(function (id) { items.push(st(id)); });
    var names = { equilibrada: "Aleatoria equilibrada", espalda: "Aleatoria de espalda", core: "Aleatoria de core" };
    return { id: "rnd-" + A.uid(), kind: "gym", name: names[opts.focus || "equilibrada"], desc: "Generada al azar", items: items, random: true };
  };

  A.randomStretch = function (count) {
    var items = shuffle(A.STRETCH).slice(0, count || 5).map(function (e) { return st(e.id); });
    return { id: "rnd-" + A.uid(), kind: "stretch", name: "Estiramientos al azar", desc: "Generada al azar", items: items, random: true };
  };

  /* Pasos que recorre el reproductor */
  A.buildSteps = function (routine) {
    var steps = [];
    routine.items.forEach(function (it, idx) {
      var ex = A.exById(it.ex);
      if (!ex) return;
      var last = idx === routine.items.length - 1;
      if (ex.kind === "gym") {
        for (var s = 1; s <= it.sets; s++) {
          steps.push({ type: "work", idx: idx, ex: ex, it: it, set: s, of: it.sets, secs: it.secs || 0, reps: it.reps || 0 });
          if (!(last && s === it.sets)) steps.push({ type: "rest", idx: idx, secs: it.rest, nextIdx: s === it.sets ? idx + 1 : idx });
        }
      } else {
        var total = (it.reps || 1) * (it.sides || 1), n = 0;
        for (var r = 1; r <= (it.reps || 1); r++) {
          for (var sd = 1; sd <= (it.sides || 1); sd++) {
            n++;
            var side = it.sides === 2 ? (sd === 1 ? "Lado izquierdo" : "Lado derecho") : "";
            steps.push({ type: "work", idx: idx, ex: ex, it: it, set: n, of: total, secs: it.hold, side: side });
            if (!(last && n === total)) {
              var between = n === total;
              steps.push({ type: "rest", idx: idx, secs: between ? 10 : 5, nextIdx: between ? idx + 1 : idx,
                label: between ? "Prepárate" : (it.sides === 2 && sd === 1 ? "Cambia de lado" : "Relaja") });
            }
          }
        }
      }
    });
    return steps;
  };

  A.estimateMin = function (routine) {
    var t = 0;
    A.buildSteps(routine).forEach(function (s) {
      if (s.type === "rest") t += s.secs;
      else t += s.secs || (s.reps * 4 + 5);
    });
    return Math.max(1, Math.round(t / 60));
  };

  A.itemSummary = function (it) {
    var ex = A.exById(it.ex);
    if (ex.kind === "gym") return it.sets + " × " + (it.secs ? it.secs + " s" : it.reps + " rep") + " · desc. " + it.rest + " s";
    return (it.reps > 1 ? it.reps + " × " : "") + it.hold + " s" + (it.sides === 2 ? " por lado" : "");
  };

  A.allRoutines = function (kind) {
    return A.data.routines.filter(function (r) { return r.kind === kind; })
      .concat(A.PRESETS.filter(function (r) { return r.kind === kind; }));
  };
  A.routineById = function (id) {
    return A.data.routines.concat(A.PRESETS).filter(function (r) { return r.id === id; })[0] || null;
  };
})(window.App);
