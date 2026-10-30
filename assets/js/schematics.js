/* ==========================================================================
   Research-page schematics, drawn as inline SVG.
   These are conceptual illustrations, not results or data; each carries a
   "Schematic" tag in its corner.
   <div data-schematic="tail|coast|circulation|ensemble"></div>
   ========================================================================== */
(function () {
  'use strict';

  var W = 600, H = 450;
  // Ink on paper, matching the charts: black for structure, a grey sea green, and clay for extremes.
  var C = {
    ink: '#151a1f',
    ink2: '#41484e',
    ink3: '#666d72',
    sea: '#476b69',
    clay: '#8e5a3e',
    rule: 'rgba(21,26,31,0.14)',
    axis: 'rgba(21,26,31,0.55)',
    paper: '#f3f1ec'
  };
  var SANS = 'Libre Franklin, Helvetica Neue, Arial, sans-serif';
  var SERIF = 'Newsreader, Georgia, serif';

  function marker(id, color) {
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">' +
      '<path d="M1 1.2L9 5L1 8.8" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>';
  }

  // Shared definitions: arrowheads, and hatching as on the home-page chart (ink for rain, clay for the heaviest).
  var DEFS = '<defs>' +
    marker('sc-arr-ink', C.ink) + marker('sc-arr-sea', C.sea) + marker('sc-arr-clay', C.clay) + marker('sc-arr-ink3', C.ink3) +
    '<pattern id="sc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="' + C.ink + '" stroke-opacity=".34" stroke-width=".8"/></pattern>' +
    '<pattern id="sc-hatch-clay" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3.4" stroke="' + C.clay + '" stroke-opacity=".75" stroke-width=".85"/></pattern>' +
    '<linearGradient id="sc-sst" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="' + C.clay + '" stop-opacity=".16"/><stop offset="1" stop-color="' + C.sea + '" stop-opacity=".14"/></linearGradient>' +
    '</defs>';

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rnd) {
    var u = 1 - rnd(), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function f1(v) { return v.toFixed(1); }
  function path(pts) {
    return pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }).join('');
  }
  // Smooth curve through points (Catmull-Rom as cubic Béziers).
  function spline(pts) {
    var d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += 'C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
    }
    return d;
  }
  var TYPE_SCALE = 1.15;   // the figures are shown small on phones, so their lettering runs a little large
  function text(x, y, s, o) {
    o = o || {};
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-family="' + (o.serif ? SERIF : SANS) + '" font-size="' + f1((o.size || 12) * TYPE_SCALE) + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.italic ? ' font-style="italic"' : '') +
      (o.spacing ? ' letter-spacing="' + o.spacing + '"' : '') + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.rotate ? ' transform="rotate(' + o.rotate + ' ' + f1(x) + ' ' + f1(y) + ')"' : '') +
      ' fill="' + (o.fill || C.ink2) + '">' + s + '</text>';
  }
  // A thin leader line from a label to the thing it names, ending in a small dot.
  function leader(x1, y1, x2, y2, color) {
    color = color || C.ink3;
    return '<path d="M' + f1(x1) + ' ' + f1(y1) + 'L' + f1(x2) + ' ' + f1(y2) + '" stroke="' + color + '" stroke-width=".8" fill="none"/>' +
      '<circle cx="' + f1(x2) + '" cy="' + f1(y2) + '" r="1.8" fill="' + color + '"/>';
  }
  function line(x1, y1, x2, y2, color, width, extra) {
    return '<path d="M' + f1(x1) + ' ' + f1(y1) + 'L' + f1(x2) + ' ' + f1(y2) + '" stroke="' + color + '" stroke-width="' + (width || 1) + '" fill="none"' + (extra || '') + '/>';
  }
  function tag() {
    return '<rect x="' + (W - 102) + '" y="14" width="88" height="20" rx="2" fill="' + C.paper + '" stroke="' + C.rule + '"/>' +
      text(W - 58, 28, 'SCHEMATIC', { size: 9.5, weight: 600, spacing: 1.6, anchor: 'middle', fill: C.ink3 });
  }
  // An irregular closed outline around (cx, cy), for rain areas.
  function blob(cx, cy, r, rnd) {
    var k = 9, a0 = rnd() * Math.PI, pts = [];
    for (var i = 0; i < k; i++) {
      var a = a0 + i / k * Math.PI * 2, rr = r * (0.8 + rnd() * 0.32);
      pts.push([cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr * 0.82]);
    }
    var z = pts[k - 1], d = 'M' + f1((z[0] + pts[0][0]) / 2) + ' ' + f1((z[1] + pts[0][1]) / 2);
    for (var j = 0; j < k; j++) {
      var p = pts[j], q = pts[(j + 1) % k];
      d += 'Q' + f1(p[0]) + ' ' + f1(p[1]) + ' ' + f1((p[0] + q[0]) / 2) + ' ' + f1((p[1] + q[1]) / 2);
    }
    return d + 'Z';
  }
  // The weather-map symbol for a tropical cyclone.
  function cyclone(x, y, s, color) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (s * 0.42) + '" fill="none" stroke="' + color + '" stroke-width="1.5"/>' +
      '<path d="M' + x + ' ' + f1(y - s * 0.42) + 'c0-' + f1(s * 0.6) + ' ' + f1(s * 0.42) + '-' + f1(s * 0.9) + ' ' + f1(s) + '-' + f1(s * 0.85) +
      'M' + x + ' ' + f1(y + s * 0.42) + 'c0 ' + f1(s * 0.6) + '-' + f1(s * 0.42) + ' ' + f1(s * 0.9) + '-' + f1(s) + ' ' + f1(s * 0.85) +
      '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>';
  }

  /* 1 — Extremes live in the tail of the precipitation distribution. */
  function tail() {
    var x0 = 74, x1 = 560, y0 = 368, yTop = 66;
    var X = function (x) { return x0 + x * (x1 - x0); };
    // Gamma distributions with shape 2; the warmer climate's scale is 18% larger.
    var pdf = function (x, th) { return (x / (th * th)) * Math.exp(-x / th); };
    var exceed = function (x, th) { var u = x / th; return (1 + u) * Math.exp(-u); };
    var thP = 0.1, thW = 0.118;
    var yScale = 250 / pdf(thP, thP);
    var x99 = thP * 6.638;                        // present-day 99th percentile: exceed(x99, thP) = 0.01
    var ratio = exceed(x99, thW) / exceed(x99, thP);
    var curve = function (th, from, to, mult) {
      var pts = [];
      for (var i = 0; i <= 160; i++) {
        var x = from + (to - from) * (i / 160);
        pts.push([X(x), y0 - pdf(x, th) * yScale * mult]);
      }
      return pts;
    };
    var area = function (pts) { return path(pts) + 'L' + f1(pts[pts.length - 1][0]) + ' ' + y0 + 'L' + f1(pts[0][0]) + ' ' + y0 + 'Z'; };
    // x on the falling side of a curve where it reaches height v (for the shift arrow)
    var fallAt = function (th, v) {
      var lo = th, hi = 1;
      for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (pdf(m, th) * yScale > v) lo = m; else hi = m; }
      return (lo + hi) / 2;
    };

    var s = '';
    for (var g = 1; g <= 4; g++) s += line(x0, y0 - g * 66, x1, y0 - g * 66, C.rule, 1);
    s += line(x0, y0, x1 + 8, y0, C.axis, 1, ' marker-end="url(#sc-arr-ink3)"');
    s += line(x0, y0, x0, yTop - 8, C.axis, 1, ' marker-end="url(#sc-arr-ink3)"');
    [['Light', 0.07], ['Moderate', 0.24], ['Heavy', 0.45], ['Extreme', 0.8]].forEach(function (t) {
      s += line(X(t[1]), y0, X(t[1]), y0 + 5, C.axis, 1);
      s += text(X(t[1]), y0 + 19, t[0], { size: 11, anchor: 'middle', fill: C.ink3 });
    });
    s += text(x1, y0 + 40, 'Daily precipitation intensity', { size: 12, anchor: 'end', weight: 500 });
    s += text(x0 - 26, (y0 + yTop) / 2, 'Frequency of days', { size: 12, anchor: 'middle', weight: 500, rotate: -90 });

    var pres = curve(thP, 0.002, 1, 1), warm = curve(thW, 0.002, 1, 1);
    var presT = curve(thP, x99, 1, 10), warmT = curve(thW, x99, 1, 10);
    s += '<path d="' + area(warm) + '" fill="' + C.clay + '" fill-opacity="0.045"/>';
    s += '<path d="' + path(pres) + '" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>';
    s += '<path d="' + path(warm) + '" fill="none" stroke="' + C.clay + '" stroke-width="1.8"/>';
    // the tail, magnified so it can be seen
    s += '<path d="' + area(warmT) + '" fill="' + C.clay + '" fill-opacity="0.1"/>';
    s += '<path d="' + area(warmT) + '" fill="url(#sc-hatch-clay)"/>';
    s += '<path d="' + area(presT) + '" fill="url(#sc-hatch)"/>';
    s += '<path d="' + path(presT) + '" fill="none" stroke="' + C.ink + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
    s += '<path d="' + path(warmT) + '" fill="none" stroke="' + C.clay + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
    s += line(X(x99), y0, X(x99), yTop + 26, C.ink, 0.9, ' stroke-dasharray="2 3" stroke-opacity=".6"');
    s += text(X(x99) + 7, yTop + 32, 'Present-day 99th percentile', { size: 11, fill: C.ink3 });
    s += text(X(x99) + 7, y0 - 196, 'Tail, magnified ×10', { size: 11.5, weight: 600, fill: C.ink });
    s += text(X(x99) + 7, y0 - 178, 'About ' + ratio.toFixed(1) + '× as many days', { size: 11.5, fill: C.clay });
    s += text(X(x99) + 7, y0 - 163, 'above the present-day', { size: 11.5, fill: C.clay });
    s += text(X(x99) + 7, y0 - 148, '99th percentile', { size: 11.5, fill: C.clay });
    s += leader(X(x99) + 30, y0 - 141, X(x99 + 0.05), y0 - pdf(x99 + 0.05, thW) * yScale * 10 + 8, C.clay);

    // the shift of the whole distribution
    var v = 118, xa = X(fallAt(thP, v)), xb = X(fallAt(thW, v)) + 6;
    s += line(xa + 4, y0 - v, xb + 12, y0 - v, C.clay, 1.3, ' marker-end="url(#sc-arr-clay)"');
    s += text(xb + 20, y0 - v + 4, 'Distribution shifts 18%', { size: 11.5, fill: C.clay });

    // legend
    s += line(214, 84, 240, 84, C.ink, 1.8) + text(248, 88, 'Present climate', { size: 11.5 });
    s += line(214, 104, 240, 104, C.clay, 1.8) + text(248, 108, 'Warmer climate', { size: 11.5 });
    return s + tag();
  }

  /* 2 — Coastal extremes: a southerly low-level jet feeding heavy rain on a Gulf-style coast. */
  function coast() {
    var s = '';
    var coastPts = [[-10, 166], [60, 158], [112, 174], [162, 168], [210, 184], [252, 178], [288, 194], [322, 204], [350, 214], [378, 234],
      [398, 226], [418, 202], [460, 190], [520, 198], [610, 186]];
    var shore = spline(coastPts);
    s += '<path d="' + shore + 'L610 -10L-10 -10Z" fill="' + C.ink + '" fill-opacity="0.035"/>';
    s += '<path d="' + shore + 'L610 460L-10 460Z" fill="' + C.sea + '" fill-opacity="0.075"/>';
    for (var r = 0; r < 4; r++) {
      var y = 404 + r * 12, pts = [];
      for (var q = 0; q <= 60; q++) { var xx = 220 + q * 6; pts.push([xx, y + Math.sin(xx / 18 + r) * 1.6]); }
      s += '<path d="' + path(pts) + '" fill="none" stroke="' + C.sea + '" stroke-opacity="' + (0.32 - r * 0.06).toFixed(2) + '" stroke-width=".8"/>';
    }
    s += '<path d="' + shore + '" fill="none" stroke="' + C.ink + '" stroke-opacity=".8" stroke-width="1.3"/>';

    // low-level jet: a broad moist southerly stream that turns north-east over land
    var jet = 'M252 452C262 362 296 262 336 208S430 122 518 96';
    s += '<path d="' + jet + '" fill="none" stroke="' + C.sea + '" stroke-opacity="0.13" stroke-width="50" stroke-linecap="round"/>';
    s += '<path d="M226 446C236 360 268 268 312 214S410 132 494 112" fill="none" stroke="' + C.sea + '" stroke-opacity=".45" stroke-dasharray="2 5"/>';
    s += '<path d="M278 452C290 364 326 268 362 220S452 140 538 116" fill="none" stroke="' + C.sea + '" stroke-opacity=".45" stroke-dasharray="2 5"/>';
    s += '<path d="' + jet + '" fill="none" stroke="' + C.sea + '" stroke-width="2" marker-end="url(#sc-arr-sea)"/>';

    // rain where the jet meets the coast; the heaviest core in clay
    var rnd = mulberry32(5);
    [[300, 214, 20], [338, 176, 34], [392, 160, 24], [420, 132, 18], [262, 202, 16]].forEach(function (c) {
      s += '<path d="' + blob(c[0], c[1], c[2], rnd) + '" fill="url(#sc-hatch)" stroke="' + C.ink + '" stroke-opacity=".42" stroke-width=".8"/>';
    });
    var core = blob(342, 176, 15, rnd);
    s += '<path d="' + core + '" fill="' + C.clay + '" fill-opacity=".14"/><path d="' + core + '" fill="url(#sc-hatch-clay)" stroke="' + C.clay + '" stroke-width="1.1"/>';

    // a tropical cyclone offshore, with faint rain bands
    var tx = 478, ty = 350;
    s += '<path d="M' + (tx - 46) + ' ' + (ty + 6) + 'a48 40 0 0 1 82 -34M' + (tx + 44) + ' ' + (ty - 4) + 'a48 40 0 0 1 -80 36" fill="none" stroke="' + C.ink + '" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>';
    s += cyclone(tx, ty, 20, C.ink);

    // labels
    s += text(34, 70, 'LAND', { size: 10.5, weight: 600, spacing: 2, fill: C.ink3 });
    s += text(112, 268, 'Gulf of Mexico', { size: 15, serif: true, italic: true, fill: C.sea });
    s += text(240, 298, 'Low-level jet', { size: 12, weight: 600, anchor: 'end', fill: C.sea });
    s += text(240, 314, 'moist southerly flow', { size: 11, anchor: 'end', fill: C.sea });
    s += leader(244, 302, 280, 298, C.sea);
    s += text(196, 104, 'Extreme rainfall', { size: 12, weight: 600, fill: C.clay });
    s += leader(262, 110, 334, 170, C.clay);
    s += text(452, 176, 'Heavy rain', { size: 12, fill: C.ink2 });
    s += leader(450, 172, 410, 156);
    s += text(tx, ty + 56, 'Tropical cyclone', { size: 12, anchor: 'middle' });

    // north arrow
    s += line(560, 92, 560, 58, C.ink, 1.2, ' marker-end="url(#sc-arr-ink)"') + text(560, 106, 'N', { size: 11, weight: 600, anchor: 'middle', fill: C.ink });

    // legend
    s += '<rect x="20" y="342" width="168" height="94" rx="2" fill="' + C.paper + '" fill-opacity=".9" stroke="' + C.rule + '"/>';
    s += line(32, 360, 58, 360, C.sea, 10, ' stroke-opacity=".18" stroke-linecap="round"') + line(32, 360, 58, 360, C.sea, 1.6) + text(68, 364, 'Low-level jet', { size: 11 });
    s += '<rect x="32" y="371" width="26" height="12" fill="url(#sc-hatch)" stroke="' + C.ink + '" stroke-opacity=".42" stroke-width=".8"/>' + text(68, 381, 'Rain', { size: 11 });
    s += '<rect x="32" y="390" width="26" height="12" fill="url(#sc-hatch-clay)" stroke="' + C.clay + '" stroke-width="1"/>' + text(68, 400, 'Heaviest rain', { size: 11 });
    s += cyclone(45, 419, 8, C.ink) + text(68, 423, 'Tropical cyclone', { size: 11 });
    return s + tag();
  }

  /* 3 — Circulation, ocean conditions and external forcing. */
  function circulation() {
    var s = '';
    var surface = 330;
    // layers
    s += '<rect x="0" y="' + surface + '" width="' + W + '" height="' + (H - surface) + '" fill="url(#sc-sst)"/>';
    s += line(0, surface, W, surface, C.ink, 1, ' stroke-opacity=".45"');
    s += text(16, 200, 'ATMOSPHERE', { size: 10, weight: 600, spacing: 2, anchor: 'middle', rotate: -90, fill: C.ink3 });
    s += text(16, 392, 'OCEAN', { size: 10, weight: 600, spacing: 2, anchor: 'middle', rotate: -90, fill: C.ink3 });
    for (var r = 0; r < 5; r++) {
      var y = surface + 20 + r * 20, pts = [];
      for (var q = 0; q <= 100; q++) { var xx = 34 + q * 5.6; pts.push([xx, y + Math.sin(xx / 20 + r) * 1.8]); }
      s += '<path d="' + path(pts) + '" fill="none" stroke="' + C.sea + '" stroke-opacity="' + (0.4 - r * 0.06).toFixed(2) + '" stroke-width=".8"/>';
    }
    s += text(44, H - 16, 'Warm', { size: 11, fill: C.clay });
    s += text(W - 18, H - 16, 'Cool', { size: 11, anchor: 'end', fill: C.sea });
    s += text(W / 2, H - 16, 'Ocean conditions (sea-surface temperature)', { size: 11.5, weight: 500, anchor: 'middle', fill: C.ink2 });

    // external forcing from above
    for (var i = 0; i < 7; i++) {
      var x = 92 + i * 70;
      s += line(x, 50, x, 82, C.clay, 1.3, ' marker-end="url(#sc-arr-clay)"');
    }
    s += text(40, 34, 'External forcing: CO₂, aerosols', { size: 12, weight: 600, fill: C.clay });

    // the meandering jet with neighbouring height contours
    var jet = function (dy, amp) {
      var pts = [];
      for (var k = 0; k <= 180; k++) {
        var x = 36 + k * 2.95;
        pts.push([x, 196 + dy + Math.sin(x / 92 - 0.6) * amp + Math.sin(x / 41) * 5]);
      }
      return pts;
    };
    var main = jet(0, 50);
    s += '<path d="' + path(jet(-30, 42)) + '" fill="none" stroke="' + C.ink + '" stroke-opacity=".3" stroke-width=".9"/>';
    s += '<path d="' + path(jet(30, 40)) + '" fill="none" stroke="' + C.ink + '" stroke-opacity=".3" stroke-width=".9"/>';
    s += '<path d="' + path(main) + '" fill="none" stroke="' + C.ink + '" stroke-width="2.4" stroke-linecap="round" marker-end="url(#sc-arr-ink)"/>';
    s += text(44, 140, 'Jet stream', { size: 12, weight: 600, fill: C.ink });
    var crest = main.reduce(function (m, p) { return p[1] < m[1] ? p : m; }, [0, 999]);
    var dip = main.reduce(function (m, p) { return p[1] > m[1] ? p : m; }, [0, -1]);
    s += '<text x="' + f1(crest[0]) + '" y="' + f1(crest[1] + 72) + '" text-anchor="middle" font-family="' + SERIF + '" font-weight="600" font-size="32" fill="' + C.ink + '">H</text>';
    s += text(crest[0], crest[1] + 90, 'Ridge', { size: 11, anchor: 'middle', fill: C.ink3 });
    s += '<text x="' + f1(dip[0]) + '" y="' + f1(dip[1] - 50) + '" text-anchor="middle" font-family="' + SERIF + '" font-weight="600" font-size="32" fill="' + C.ink + '">L</text>';
    s += text(dip[0], dip[1] - 92, 'Trough', { size: 11, anchor: 'middle', fill: C.ink3 });

    // a storm on the storm track, just downstream of the trough
    var sx = dip[0] + 92, sy = dip[1] + 2;
    s += '<path d="M' + f1(sx - 15) + ' ' + f1(sy) + 'a15 12 0 1 1 15 12a9 7 0 1 1 -6 -9" fill="none" stroke="' + C.ink + '" stroke-width="1.3" stroke-opacity=".7"/>';
    s += text(sx + 22, sy + 4, 'Storm track', { size: 11, fill: C.ink3 });

    // moisture drawn up from the ocean into the storm
    [[150, surface - 4, 196, 262], [300, surface - 4, 320, 262], [450, surface - 4, 400, 262]].forEach(function (m) {
      var cx = (m[0] + m[2]) / 2 + 26, cy = (m[1] + m[3]) / 2 + 12;
      s += '<path d="M' + m[0] + ' ' + m[1] + 'Q' + cx + ' ' + cy + ' ' + m[2] + ' ' + m[3] + '" fill="none" stroke="' + C.sea + '" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#sc-arr-sea)"/>';
    });
    s += text(476, 300, 'Moisture transport', { size: 11.5, weight: 500, fill: C.sea });
    return s + tag();
  }

  /* 4 — Forced signal vs. internal variability. */
  function ensemble() {
    var x0 = 74, x1 = 560, yZero = 300, yTop = 64, yBot = 372;
    var n = 120, members = 12, now = 0.62;
    var rnd = mulberry32(42);
    var forced = function (t) { return yZero - 170 * Math.pow(t, 1.7); };
    var X = function (t) { return x0 + t * (x1 - x0); };
    var lines = [], lo = [], hi = [];
    for (var m = 0; m < members; m++) {
      var e = 0, pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        e = 0.82 * e + gauss(rnd) * 7;
        var y = forced(t) + e;
        pts.push([X(t), y]);
        if (m === 0) { lo[i] = y; hi[i] = y; } else { lo[i] = Math.max(lo[i], y); hi[i] = Math.min(hi[i], y); }
      }
      lines.push(pts);
    }
    var s = '';
    // the future, lightly shaded
    s += '<rect x="' + f1(X(now)) + '" y="' + yTop + '" width="' + f1(x1 - X(now)) + '" height="' + (yBot - yTop) + '" fill="' + C.ink + '" fill-opacity=".03"/>';
    for (var g = 0; g < 4; g++) s += line(x0, yBot - g * 77, x1, yBot - g * 77, C.rule, 1);
    s += line(x0, yZero, x1, yZero, C.ink, 0.9, ' stroke-opacity=".5" stroke-dasharray="3 3"');
    s += text(x1 - 4, yZero + 15, 'No change', { size: 10.5, anchor: 'end', fill: C.ink3 });
    s += line(x0, yBot, x1 + 8, yBot, C.axis, 1, ' marker-end="url(#sc-arr-ink3)"');
    s += line(x0, yBot, x0, yTop - 8, C.axis, 1, ' marker-end="url(#sc-arr-ink3)"');
    [['Past', 0.12], ['Present', now], ['Future', 0.86]].forEach(function (tk) {
      s += line(X(tk[1]), yBot, X(tk[1]), yBot + 5, C.axis, 1);
      s += text(X(tk[1]), yBot + 19, tk[0], { size: 11, anchor: 'middle', fill: C.ink3 });
    });
    s += text(x1, yBot + 40, 'Time', { size: 12, anchor: 'end', weight: 500 });
    s += text(x0 - 26, (yBot + yTop) / 2, 'Change in precipitation', { size: 12, anchor: 'middle', weight: 500, rotate: -90 });

    // spread of the ensemble = internal variability
    var top = hi.map(function (y, i) { return [X(i / n), y]; });
    var bottom = lo.map(function (y, i) { return [X(i / n), y]; }).reverse();
    s += '<path d="' + path(top.concat(bottom)) + 'Z" fill="' + C.sea + '" fill-opacity="0.09"/>';
    lines.forEach(function (pts) {
      s += '<path d="' + path(pts) + '" fill="none" stroke="' + C.sea + '" stroke-opacity="0.38" stroke-width="0.7"/>';
    });
    var f = [];
    for (var k = 0; k <= n; k++) f.push([X(k / n), forced(k / n)]);
    s += '<path d="' + path(f) + '" fill="none" stroke="' + C.clay + '" stroke-width="2.4"/>';
    // one observed record, up to the present
    var rndObs = mulberry32(7), eo = 0, obs = [];
    for (var j = 0; j <= Math.round(n * now); j++) {
      eo = 0.8 * eo + gauss(rndObs) * 7.5;
      obs.push([X(j / n), forced(j / n) + eo]);
    }
    s += '<path d="' + path(obs) + '" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>';
    var oe = obs[obs.length - 1];
    s += '<circle cx="' + f1(oe[0]) + '" cy="' + f1(oe[1]) + '" r="3.2" fill="' + C.ink + '"/>';
    s += line(X(now), yBot, X(now), yTop + 18, C.ink, 0.9, ' stroke-opacity=".45" stroke-dasharray="2 3"');
    s += text(X(now) + 8, yTop + 26, 'Projection', { size: 11, fill: C.ink3 });

    // labels
    var tf = 0.3, fy = forced(tf);
    s += text(X(0.12), fy - 64, 'Forced signal', { size: 12, weight: 600, fill: C.clay });
    s += leader(X(0.2), fy - 58, X(tf), fy - 2, C.clay);
    s += text(X(0.3), yTop + 44, 'One observed record', { size: 12, weight: 600, fill: C.ink });
    s += leader(X(0.3) + 30, yTop + 50, obs[Math.round(n * 0.34)][0], obs[Math.round(n * 0.34)][1] - 4, C.ink);
    var tq = Math.round(n * 0.8);
    s += text(X(0.78), yBot - 14, 'Spread: internal variability', { size: 12, weight: 600, anchor: 'middle', fill: C.sea });
    s += leader(X(0.78), yBot - 28, X(0.8), lo[tq] + 2, C.sea);
    return s + tag();
  }

  var DRAW = { tail: tail, coast: coast, circulation: circulation, ensemble: ensemble };

  Array.prototype.forEach.call(document.querySelectorAll('[data-schematic]'), function (el) {
    var fn = DRAW[el.getAttribute('data-schematic')];
    if (!fn) return;
    var label = el.getAttribute('data-label') || 'Schematic illustration';
    if (!/^schematic/i.test(label)) label = 'Schematic: ' + label;
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '">' + DEFS + fn() + '</svg>';
  });
})();
