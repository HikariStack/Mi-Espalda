/* Mi Espalda — silueta posterior con zonas */
(function (A) {
  "use strict";

  // Contorno izquierdo (vista de espalda: izquierda del dibujo = lado izquierdo de la persona)
  var LEFT = [
    [91, 50], [80, 64], [64, 72], [49, 80], [40, 95], [36, 122], [33, 160], [30, 196], [29, 222],
    [26, 238], [30, 250], [37, 247], [40, 228], [42, 198], [46, 162], [50, 130], [56, 118],
    [58, 150], [62, 194], [60, 218], [55, 248], [57, 292], [63, 334], [61, 358], [65, 388],
    [70, 407], [68, 417], [82, 421], [89, 410], [90, 380], [92, 338], [95, 292], [100, 264]
  ];

  function outlinePoints() {
    var right = LEFT.slice(0, -1).reverse().map(function (p) { return [200 - p[0], p[1]]; });
    return LEFT.concat(right);
  }

  // Catmull-Rom cerrado → Bézier
  function smoothClosed(pts) {
    var n = pts.length, d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2[0] + " " + p2[1];
    }
    return d + "Z";
  }
  var BODY = smoothClosed(outlinePoints());

  // Zonas (se recortan con la silueta). Orden = orden de dibujo.
  var SHAPES = [
    { id: "trap-izq",   d: "M20 60H100V110H20Z" },
    { id: "trap-der",   d: "M100 60H180V110H100Z" },
    { id: "cervical",   d: "M84 40H116V78Q100 84 84 78Z" },
    { id: "dorsal-izq", d: "M52 110H100V176H52Z" },
    { id: "dorsal-der", d: "M100 110H148V176H100Z" },
    { id: "lumbar-izq", d: "M52 176H100V224H52Z" },
    { id: "lumbar-der", d: "M100 176H148V224H100Z" },
    { id: "gluteo-izq", d: "M48 224H100V292H48Z" },
    { id: "gluteo-der", d: "M100 224H152V292H100Z" },
    { id: "sacro",      d: "M86 222H114L108 262Q100 268 92 262Z" },
    { id: "pierna-izq", d: "M48 292H100V430H48Z" },
    { id: "pierna-der", d: "M100 292H152V430H100Z" }
  ];

  var ANAT = [
    "M70 116Q64 140 84 158", "M130 116Q136 140 116 158",          // escápulas
    "M60 222Q100 208 140 222",                                      // cresta ilíaca
    "M60 292Q79 300 98 291", "M140 292Q121 300 102 291",            // pliegue glúteo
    "M76 70Q88 76 96 74", "M124 70Q112 76 104 74"                   // trapecio
  ];

  var seq = 0;

  /*
   * opts.mode: "view" (colorea por dolor) | "select" (elige zonas)
   * opts.selected: array de ids (modo select)
   * opts.days: ventana para modo view
   */
  A.bodyMap = function (opts) {
    opts = opts || {};
    var id = "bm" + (++seq);
    var sel = opts.selected || [];
    var s = '<svg class="bodymap" viewBox="0 0 200 442" role="img" aria-label="Silueta de espalda con zonas">' +
      '<defs><clipPath id="' + id + '"><path d="' + BODY + '"/></clipPath></defs>' +
      '<ellipse class="bm-sil" cx="100" cy="30" rx="20" ry="24"/>' +
      '<path class="bm-sil" d="' + BODY + '"/>' +
      '<g clip-path="url(#' + id + ')">';
    SHAPES.forEach(function (z) {
      var fill;
      if (opts.mode === "select") {
        fill = sel.indexOf(z.id) !== -1 ? "var(--accent)" : "var(--surface-3)";
      } else {
        fill = A.painColor(A.zoneMax(z.id, opts.days || 14));
      }
      s += '<path class="bm-zone" data-zone="' + z.id + '" d="' + z.d + '" fill="' + fill + '" stroke="var(--surface)" stroke-width="1.6"><title>' + A.zoneLabel(z.id) + '</title></path>';
    });
    s += '</g>';
    ANAT.forEach(function (d) { s += '<path class="bm-anat" d="' + d + '"/>'; });
    s += '<path class="bm-spine" d="M100 58V262"/>';
    s += '<path d="' + BODY + '" fill="none" stroke="var(--line)" stroke-width="1.2" pointer-events="none"/>';
    s += '<text class="bm-side" x="30" y="438">IZQ</text><text class="bm-side" x="154" y="438">DER</text>';
    s += '</svg>';
    return s;
  };
})(window.App);
