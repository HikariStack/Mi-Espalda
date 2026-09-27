/* Mi Espalda — ilustraciones animadas de ejercicios (pictogramas) */
(function (A) {
  "use strict";

  var KEYS = ["h", "s", "e", "w", "p", "k", "a", "t"];

  // "hx hy sx sy ex ey wx wy px py kx ky ax ay tx ty [c]"
  function parsePose(str) {
    var n = str.trim().split(/\s+/).map(Number), o = {};
    KEYS.forEach(function (k, i) { o[k] = [n[i * 2], n[i * 2 + 1]]; });
    o.c = n[16] || 0;
    return o;
  }
  function pts(str) { // "x y x y ..." -> [[x,y],...]
    var n = str.trim().split(/\s+/).map(Number), out = [];
    for (var i = 0; i < n.length; i += 2) out.push([n[i], n[i + 1]]);
    return out;
  }

  function torsoD(o) {
    var s = o.s, p = o.p, mx = (s[0] + p[0]) / 2, my = (s[1] + p[1]) / 2;
    var dx = p[0] - s[0], dy = p[1] - s[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / len, ny = dx / len; // normal
    var cx = mx + nx * o.c, cy = my + ny * o.c;
    return "M" + s[0] + " " + s[1] + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + p[0] + " " + p[1];
  }

  function anim(attr, a, b, dur) {
    if (a === b) return "";
    return '<animate attributeName="' + attr + '" values="' + a + ";" + b + ";" + a + '" dur="' + dur + 's" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>';
  }

  function line(cls, p1a, p2a, p1b, p2b, dur, go) {
    var s = '<line class="' + cls + '" x1="' + p1a[0] + '" y1="' + p1a[1] + '" x2="' + p2a[0] + '" y2="' + p2a[1] + '">';
    if (go) {
      s += anim("x1", p1a[0], p1b[0], dur) + anim("y1", p1a[1], p1b[1], dur) +
           anim("x2", p2a[0], p2b[0], dur) + anim("y2", p2a[1], p2b[1], dur);
    }
    return s + "</line>";
  }

  function polyD(arr) { return "M" + arr.map(function (p) { return p[0] + " " + p[1]; }).join(" L"); }

  /*
   * ex.fig = { a:"pose", b:"pose", leg2:"kx ky ax ay tx ty" | {a,b}, arm2:"ex ey wx wy" | {a,b}, eq:[...], dur }
   * equipamiento:
   *   {l:[x1,y1,x2,y2], w}           línea fija
   *   {r:[x,y,w,h], rx}              rectángulo fijo relleno
   *   {c:[cx,cy,r]}                  círculo fijo relleno
   *   {cable:[x,y], to:"w"}          cable desde un punto fijo a una articulación
   *   {att:"w", r:[dx,dy,w,h]} / {att:"w", c:[dx,dy,r]} / {att:"a", l:[x1,y1,x2,y2], w}
   *   {link:["w","t"]}               toalla/banda entre dos articulaciones
   *   {mat:true}                     esterilla
   */
  A.figure = function (ex, opt) {
    opt = opt || {};
    var f = ex.fig, go = opt.animate !== false;
    var A0 = parsePose(f.a), B0 = f.b ? parsePose(f.b) : A0;
    var dur = f.dur || (ex.kind === "stretch" ? 5 : 3.2);
    var s = '<svg viewBox="0 0 120 90" aria-hidden="true" preserveAspectRatio="xMidYMid meet">';
    s += '<line class="eq-floor" x1="4" y1="84.5" x2="116" y2="84.5"/>';

    var eq = f.eq || [];
    // fijos detrás
    eq.forEach(function (q) {
      if (q.mat) s += '<rect x="10" y="83" width="100" height="3" rx="1.5" fill="var(--accent-soft)"/>';
      else if (q.l && !q.att) s += '<line class="eq" x1="' + q.l[0] + '" y1="' + q.l[1] + '" x2="' + q.l[2] + '" y2="' + q.l[3] + '" stroke-width="' + (q.w || 2.4) + '"/>';
      else if (q.r && !q.att) s += '<rect class="eq-fill" x="' + q.r[0] + '" y="' + q.r[1] + '" width="' + q.r[2] + '" height="' + q.r[3] + '" rx="' + (q.rx == null ? 1.5 : q.rx) + '"/>';
      else if (q.c && !q.att) s += '<circle class="eq-fill" cx="' + q.c[0] + '" cy="' + q.c[1] + '" r="' + q.c[2] + '"/>';
    });
    // cables
    eq.forEach(function (q) {
      if (q.cable) s += line("eq-cable", q.cable, A0[q.to], q.cable, B0[q.to], dur, go);
      if (q.link) s += line("eq-cable", A0[q.link[0]], A0[q.link[1]], B0[q.link[0]], B0[q.link[1]], dur, go).replace("eq-cable", "eq-cable\" style=\"stroke-dasharray:none;stroke-width:1.6");
    });

    // extremidades del lado lejano
    function limb2(spec, joints, root) {
      if (!spec) return "";
      var a = typeof spec === "string" ? spec : spec.a, b = typeof spec === "string" ? spec : (spec.b || spec.a);
      var pa = pts(a), pb = pts(b), out = "";
      var ra = A0[root], rb = B0[root];
      var chainA = [ra].concat(pa), chainB = [rb].concat(pb);
      out += '<path class="fig-limb2" d="' + polyD(chainA) + '">' + (go ? anim("d", polyD(chainA), polyD(chainB), dur) : "") + "</path>";
      return out;
    }
    s += limb2(f.leg2, 3, "p");
    s += limb2(f.arm2, 2, "s");

    // torso
    var tA = torsoD(A0), tB = torsoD(B0);
    s += '<path class="fig-torso" d="' + tA + '">' + (go ? anim("d", tA, tB, dur) : "") + "</path>";
    // pierna
    var legA = polyD([A0.p, A0.k, A0.a, A0.t]), legB = polyD([B0.p, B0.k, B0.a, B0.t]);
    s += '<path class="fig-limb" d="' + legA + '">' + (go ? anim("d", legA, legB, dur) : "") + "</path>";
    // brazo
    var armA = polyD([A0.s, A0.e, A0.w]), armB = polyD([B0.s, B0.e, B0.w]);
    s += '<path class="fig-limb" d="' + armA + '">' + (go ? anim("d", armA, armB, dur) : "") + "</path>";
    // cabeza
    s += '<circle class="fig-head" cx="' + A0.h[0] + '" cy="' + A0.h[1] + '" r="5.6">' +
      (go ? anim("cx", A0.h[0], B0.h[0], dur) + anim("cy", A0.h[1], B0.h[1], dur) : "") + "</circle>";

    // equipamiento unido a articulaciones (delante)
    eq.forEach(function (q) {
      if (!q.att) return;
      var ja = A0[q.att], jb = B0[q.att], shape = "";
      if (q.r) shape = '<rect class="eq-fill" x="' + q.r[0] + '" y="' + q.r[1] + '" width="' + q.r[2] + '" height="' + q.r[3] + '" rx="1.2" style="fill:var(--figure-2)"/>';
      if (q.c) shape = '<circle class="eq-fill" cx="' + q.c[0] + '" cy="' + q.c[1] + '" r="' + q.c[2] + '" style="fill:var(--figure-2)"/>';
      if (q.l) shape = '<line class="eq" x1="' + q.l[0] + '" y1="' + q.l[1] + '" x2="' + q.l[2] + '" y2="' + q.l[3] + '" stroke-width="' + (q.w || 3) + '"/>';
      s += '<g transform="translate(' + ja[0] + " " + ja[1] + ')">' +
        (go && (ja[0] !== jb[0] || ja[1] !== jb[1]) ? '<animateTransform attributeName="transform" type="translate" values="' + ja[0] + " " + ja[1] + ";" + jb[0] + " " + jb[1] + ";" + ja[0] + " " + ja[1] + '" dur="' + dur + 's" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>' : "") +
        shape + "</g>";
    });
    return s + "</svg>";
  };
})(window.App);
