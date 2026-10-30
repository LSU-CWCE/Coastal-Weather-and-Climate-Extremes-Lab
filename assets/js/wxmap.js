/* ==========================================================================
   Charts drawn in the manner of a printed daily weather map.

   data-chart  "surface"  isobars, a stalled front, station plots, hatched rain
               "upper"    500-hPa heights
               "sst"      sea-surface temperature, with the Loop Current
               "locator"  south Louisiana, for the contact page
   data-theme  "paper" (ink on paper, the default) or "night" (light ink on dark)
   data-view   which framing to use: "hero", "band", "alt", or the default
   data-flow   if present, fine wind streaks drift through the chart's own
               wind field (or ocean currents on the SST chart)

   The weather and ocean fields are invented for illustration. They are not
   observed or model data. Coastlines and borders are simplified.
   ========================================================================== */
(function () {
  'use strict';

  var RAD = Math.PI / 180;
  var SANS = '"Libre Franklin", "Helvetica Neue", Arial, sans-serif';
  var SERIF = 'Newsreader, Georgia, serif';

  var THEMES = {
    paper: {
      ink: '21,26,31', k: 1, clay: '142,90,62',
      land: 'rgb(243,241,236)', sea: 'rgba(71,107,105,0.085)', lake: 'rgba(71,107,105,0.085)',
      halo: 'rgba(243,241,236,0.92)', river: 'rgba(71,107,105,0.55)'
    },
    night: {
      ink: '231,232,228', k: 0.74, clay: '201,160,135',
      land: 'rgb(18,26,33)', sea: 'rgba(0,0,0,0)', lake: 'rgb(11,17,23)',
      halo: 'rgba(14,21,28,0.88)', river: 'rgba(163,186,182,0.45)'
    }
  };
  var T = THEMES.paper;

  function ink(a) { return 'rgba(' + T.ink + ',' + (a * T.k).toFixed(3) + ')'; }
  function clay(a) { return 'rgba(' + T.clay + ',' + a + ')'; }

  /* ---------- Geography, as [lat, lon] ---------- */

  // Shoreline from Chetumal round the Yucatán, the Gulf and Florida to North Carolina.
  var COAST = [
    [18.5, -88.0], [19.5, -87.6], [20.2, -87.4], [21.1, -86.8], [21.55, -87.1], [21.55, -88.2], [21.3, -89.6],
    [20.9, -90.4], [19.4, -90.7], [18.65, -91.8], [18.45, -93.0], [18.15, -94.5], [18.7, -95.6],
    [19.2, -96.1], [20.0, -96.6], [20.5, -97.05], [21.0, -97.3], [21.5, -97.4], [22.2, -97.82], [22.5, -97.85],
    [23.3, -97.75], [24.0, -97.73], [24.5, -97.7], [25.0, -97.48], [25.5, -97.3], [25.96, -97.15],
    [26.5, -97.27], [27.0, -97.37], [27.5, -97.27], [27.83, -97.05], [28.05, -96.85], [28.3, -96.55],
    [28.45, -96.3], [28.6, -96.0], [28.75, -95.6], [28.9, -95.3], [29.1, -95.05], [29.28, -94.8],
    [29.45, -94.55], [29.58, -94.2], [29.68, -93.84], [29.74, -93.6], [29.77, -93.3], [29.75, -93.0],
    [29.7, -92.7], [29.58, -92.3], [29.54, -92.05], [29.48, -91.8], [29.53, -91.55], [29.38, -91.38],
    [29.25, -91.1], [29.1, -90.85], [29.05, -90.6], [29.1, -90.35], [29.18, -90.1], [29.25, -89.95],
    [29.3, -89.75], [29.22, -89.55], [29.05, -89.45], [28.93, -89.42], [29.03, -89.3], [28.98, -89.15],
    [29.12, -89.08], [29.18, -88.99], [29.35, -89.15], [29.5, -89.4], [29.65, -89.55], [29.82, -89.52],
    [29.95, -89.42], [30.0, -89.45], [30.02, -89.7], [30.1, -89.85], [30.18, -89.72], [30.2, -89.55],
    [30.28, -89.38], [30.3, -89.33], [30.32, -89.2], [30.38, -89.0], [30.39, -88.85], [30.36, -88.6],
    [30.35, -88.45], [30.38, -88.3], [30.25, -88.2], [30.22, -88.03], [30.23, -88.0], [30.25, -87.75],
    [30.28, -87.5], [30.32, -87.3], [30.38, -86.9], [30.39, -86.5], [30.33, -86.2], [30.24, -85.95],
    [30.13, -85.75], [29.98, -85.55], [29.82, -85.45], [29.68, -85.37], [29.72, -85.25], [29.65, -85.08],
    [29.6, -84.95], [29.7, -84.75], [29.85, -84.55], [29.95, -84.35], [30.05, -84.2], [30.0, -83.95],
    [29.85, -83.65], [29.62, -83.4], [29.35, -83.18], [29.15, -83.05], [28.95, -82.8], [28.7, -82.68],
    [28.4, -82.68], [28.15, -82.8], [27.92, -82.83], [27.75, -82.75], [27.55, -82.73], [27.35, -82.6],
    [27.1, -82.45], [26.85, -82.3], [26.55, -82.15], [26.4, -81.95], [26.15, -81.82], [25.95, -81.73],
    [25.75, -81.55], [25.45, -81.15], [25.15, -81.1], [25.12, -80.95], [25.2, -80.6], [25.3, -80.38],
    [25.55, -80.3], [25.78, -80.13], [26.1, -80.1], [26.5, -80.05], [26.95, -80.07], [27.45, -80.28],
    [27.9, -80.48], [28.25, -80.6], [28.45, -80.53], [28.75, -80.72], [29.1, -80.95], [29.45, -81.12],
    [29.9, -81.28], [30.35, -81.4], [30.7, -81.45], [31.15, -81.38], [31.55, -81.18], [32.0, -80.85],
    [32.35, -80.55], [32.7, -80.0], [32.85, -79.75], [33.2, -79.2], [33.6, -78.95], [33.88, -78.3],
    [34.2, -77.8], [34.6, -77.1], [34.7, -76.6], [35.1, -75.9], [35.25, -75.5]
  ];
  // Points well off the map that close the shoreline into a land polygon.
  var COAST_CLOSE = [[40, -74], [45, -74], [45, -115], [15, -115], [15, -88]];
  var LAND = COAST.concat(COAST_CLOSE);

  var LAKES = [
    [[30.03, -90.44], [30.15, -90.46], [30.27, -90.43], [30.34, -90.25], [30.36, -90.05], [30.3, -89.85], [30.18, -89.76], [30.06, -89.85], [30.02, -90.05], [30.02, -90.25]], // Pontchartrain
    [[30.22, -90.55], [30.3, -90.58], [30.32, -90.48], [30.26, -90.44]], // Maurepas
    [[30.24, -88.08], [30.4, -88.12], [30.6, -88.06], [30.68, -88.0], [30.62, -87.92], [30.45, -87.9], [30.3, -87.8], [30.24, -87.95]], // Mobile Bay
    [[29.35, -94.85], [29.5, -94.98], [29.7, -94.98], [29.75, -94.75], [29.55, -94.6], [29.42, -94.7]], // Galveston Bay
    [[27.6, -82.7], [27.75, -82.65], [27.95, -82.55], [27.85, -82.42], [27.65, -82.5]], // Tampa Bay
    [[26.7, -80.85], [26.8, -81.05], [27.05, -81.0], [27.2, -80.85], [27.1, -80.65], [26.85, -80.65]], // Okeechobee
    [[29.75, -93.92], [29.95, -93.94], [30.0, -93.8], [29.85, -93.75]], // Sabine Lake
    [[29.82, -93.38], [30.02, -93.36], [30.0, -93.24], [29.83, -93.27]], // Calcasieu Lake
    [[29.58, -92.1], [29.8, -92.15], [29.82, -91.85], [29.6, -91.82]] // Vermilion Bay
  ];

  var RIVERS = [
    [[34.9, -90.2], [34.2, -90.6], [33.5, -91.1], [33.0, -91.12], [32.3, -90.92], [31.9, -91.2], [31.5, -91.45], [31.0, -91.6], [30.7, -91.38], [30.45, -91.2], [30.15, -90.95], [30.05, -90.6], [29.95, -90.1], [29.85, -89.95], [29.6, -89.75], [29.3, -89.4], [29.15, -89.25]], // Mississippi
    [[31.0, -91.6], [30.6, -91.75], [30.2, -91.75], [29.8, -91.4], [29.5, -91.4]], // Atchafalaya
    [[31.0, -91.6], [31.3, -92.4], [31.8, -93.0], [32.5, -93.75], [33.0, -94.0], [33.55, -94.04]] // Red
  ];

  var BORDERS = [
    [[29.68, -93.84], [30.05, -93.72], [30.45, -93.72], [30.9, -93.56], [31.25, -93.6], [31.65, -93.8], [32.0, -94.04], [33.55, -94.04]],
    [[33.02, -94.04], [33.02, -91.16]],
    [[33.02, -91.16], [32.6, -91.1], [32.25, -90.95], [31.9, -91.25], [31.5, -91.5], [31.0, -91.63], [31.0, -89.73], [30.65, -89.75], [30.18, -89.55]],
    [[33.02, -91.16], [33.5, -91.1], [34.0, -90.9], [34.6, -90.55], [35.0, -90.1]],
    [[30.37, -88.4], [31.0, -88.43], [32.0, -88.46], [33.0, -88.34], [34.0, -88.2], [35.0, -88.2]],
    [[30.28, -87.52], [30.6, -87.4], [31.0, -87.6], [31.0, -85.0]],
    [[31.0, -85.0], [31.5, -85.05], [32.0, -85.05], [32.85, -85.18], [35.0, -85.6]],
    [[31.0, -85.0], [30.7, -84.86], [30.6, -83.0], [30.6, -82.2], [30.45, -82.05], [30.75, -81.95], [30.72, -81.45]],
    [[32.0, -80.85], [32.5, -81.2], [33.2, -81.8], [33.6, -82.2], [34.4, -83.1], [35.0, -83.1]],
    [[33.55, -94.04], [33.65, -94.48], [33.9, -95.3], [33.85, -96.0], [33.9, -96.6], [33.85, -97.2], [34.0, -97.9], [34.15, -98.6], [34.3, -99.2], [34.55, -99.95]],
    [[33.65, -94.48], [36.5, -94.62]],
    [[35.0, -90.1], [35.0, -85.6]]
  ];
  var NATIONAL = [[25.96, -97.15], [26.05, -97.65], [26.2, -98.2], [26.35, -98.8], [26.85, -99.25], [27.5, -99.5], [28.2, -100.3], [29.2, -100.9], [29.8, -101.4]];

  var HOME = [30.45, -91.19]; // Baton Rouge

  function isLand(lat, lon) {
    var inside = false;
    for (var i = 0, j = LAND.length - 1; i < LAND.length; j = i++) {
      var yi = LAND[i][0], xi = LAND[i][1], yj = LAND[j][0], xj = LAND[j][1];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  /* ---------- The illustrative fields ---------- */

  // Surface: a slow-moving low on a front stalled along the coast, the classic set-up for Gulf Coast flooding rain.
  var FRONT = [[27.6, -100.5], [28.4, -98.4], [29.1, -96.4], [29.75, -94.4], [30.2, -92.7], [30.35, -91.7], [30.6, -90.4], [30.8, -89.0], [30.95, -87.6], [30.9, -86.0], [30.6, -84.4], [30.3, -82.8], [30.0, -81.2], [29.8, -79.5]];
  var LOW = [30.35, -91.7];
  var HIGHS = [[27.0, -83.4], [32.8, -98.6]];

  // Station plots: lat, lon, temperature and dew point (°F), cloud cover (eighths), name.
  var STATIONS = [
    [29.98, -95.36, 88, 74, 6, 'Houston'],
    [30.13, -93.22, 82, 77, 8, 'Lake Charles'],
    [32.45, -93.82, 90, 70, 4, 'Shreveport'],
    [32.32, -90.08, 81, 73, 6, 'Jackson'],
    [30.69, -88.24, 80, 76, 8, 'Mobile'],
    [30.39, -84.35, 86, 74, 4, 'Tallahassee'],
    [27.98, -82.53, 89, 75, 2, 'Tampa'],
    [29.53, -98.47, 93, 68, 2, 'San Antonio'],
    [27.77, -97.5, 88, 76, 4, 'Corpus Christi'],
    [27.9, -95.35, 84, 78, 6, ''],
    [26.3, -93.6, 85, 77, 4, ''],
    [26.3, -89.7, 85, 77, 6, ''],
    [26.3, -85.6, 86, 76, 2, ''],
    [28.5, -84.5, 87, 76, 2, '']
  ];

  // Ocean: the Loop Current entering through the Yucatán Channel and a warm eddy shed to the west.
  var LOOP = [[21.6, -86.2], [23.2, -86.4], [25.0, -86.9], [26.4, -87.6], [27.0, -87.3], [27.25, -86.6], [27.0, -85.8], [26.5, -85.1], [25.3, -84.0], [24.3, -82.6], [24.2, -81.0]];
  var EDDY = [26.3, -91.4];

  function bump(lat, lon, la, lo, sy, sx) {
    var a = (lat - la) / sy, b = (lon - lo) / sx;
    return Math.exp(-0.5 * (a * a + b * b));
  }

  // Distance in degrees (longitude scaled by latitude) from a point to a polyline.
  function pathDist(path, lat, lon) {
    var c = Math.cos(lat * RAD), px = lon * c, best = Infinity;
    for (var i = 0; i < path.length - 1; i++) {
      var ax = path[i][1] * c, ay = path[i][0], dx = path[i + 1][1] * c - ax, dy = path[i + 1][0] - ay;
      var t = Math.max(0, Math.min(1, ((px - ax) * dx + (lat - ay) * dy) / (dx * dx + dy * dy)));
      var ex = ax + t * dx - px, ey = ay + t * dy - lat;
      best = Math.min(best, ex * ex + ey * ey);
    }
    return Math.sqrt(best);
  }

  function pressure(lat, lon) {
    var d = pathDist(FRONT, lat, lon);
    return 1015 + 0.25 * (lat - 30)
      - 12 * bump(lat, lon, LOW[0], LOW[1], 1.5, 2.1)
      + 6.5 * bump(lat, lon, HIGHS[0][0], HIGHS[0][1], 3.2, 4.5)
      + 7.5 * bump(lat, lon, HIGHS[1][0], HIGHS[1][1], 2.6, 3.6)
      - 2.2 * Math.exp(-d * d / 0.3);
  }

  function rain(lat, lon) {
    var d = pathDist(FRONT, lat, lon);
    var r = 0.95 * bump(lat, lon, 30.52, -90.95, 0.38, 0.7) // the stalled core over the Baton Rouge area
      + 0.38 * bump(lat, lon, 30.3, -91.3, 1.0, 1.9) // the low's rain shield
      + 0.42 * Math.exp(-d * d / 0.3) * bump(lat, lon, 30.6, -89.8, 2.6, 4.5) // along the front
      + 0.32 * bump(lat, lon, 29.1, -90.2, 0.65, 1.1) // bands in the moist inflow
      + 0.34 * bump(lat, lon, 28.2, -92.2, 0.45, 0.75) // showers over the Gulf
      + 0.28 * bump(lat, lon, 27.5, -88.8, 0.4, 0.65);
    var texture = 0.16 * Math.sin(lat * 4.3 + lon * 2.1 + 0.7) * Math.sin(lat * 2.9 - lon * 3.7 + 1.9) +
      0.08 * Math.sin(lat * 9.1 - lon * 6.3 + 0.4);
    return r + texture * Math.min(1, r * 1.5);
  }
  var RAIN_LEVELS = [0.36, 0.7, 1.15];

  // 500-hPa geopotential height (dam): a trough over the southern Plains, ridging to the east.
  function heights(lat, lon) {
    return 591 - 2.7 * (lat - 24)
      - 15 * bump(lat, lon, 36, -98, 3.4, 5.5)
      + 5 * bump(lat, lon, 27, -80, 4, 7)
      + 3 * bump(lat, lon, 33, -84, 3, 4);
  }

  function sst(lat, lon) {
    if (isLand(lat, lon)) return NaN;
    var d = pathDist(LOOP, lat, lon);
    return 25.0 - 0.8 * (lat - 25.5)
      + 2.4 * Math.exp(-d * d / 0.45)
      + 1.6 * bump(lat, lon, EDDY[0], EDDY[1], 0.95, 1.1);
  }

  // Flow along the contours of a field, as geostrophic wind runs along isobars: [eastward, northward].
  function alongContours(fn, lat, lon, turn) {
    var e = 0.05, c = Math.cos(lat * RAD);
    var gx = (fn(lat, lon + e) - fn(lat, lon - e)) / (2 * e * c);
    var gy = (fn(lat + e, lon) - fn(lat - e, lon)) / (2 * e);
    if (gx !== gx || gy !== gy) return null;
    var u = -gy, v = gx, a = (turn || 0) * RAD;
    return [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)];
  }
  // Surface winds cross the isobars slightly toward low pressure.
  function surfaceWind(lat, lon) { return alongContours(pressure, lat, lon, 22); }
  function upperWind(lat, lon) { return alongContours(heights, lat, lon, 0); }
  function current(lat, lon) { return alongContours(sst, lat, lon, 0); }

  /* ---------- Projection: Lambert conformal conic, as on many printed charts ---------- */

  // (lat, lon) is drawn at the fraction (fx, fy) of the frame; span is degrees of longitude across it.
  function makeView(w, h, c) {
    var p1 = c.parallel * RAD, n = Math.sin(p1);
    var F = Math.cos(p1) * Math.pow(Math.tan(Math.PI / 4 + p1 / 2), n) / n;
    function fwd(lat, lon) {
      var r = F / Math.pow(Math.tan(Math.PI / 4 + lat * RAD / 2), n), t = n * (lon - c.meridian) * RAD;
      return [r * Math.sin(t), -r * Math.cos(t)];
    }
    var o = fwd(c.lat, c.lon);
    var s = w / (c.span * RAD * Math.cos(c.lat * RAD));
    var cx = (c.fx == null ? 0.5 : c.fx) * w, cy = (c.fy == null ? 0.5 : c.fy) * h;
    return {
      w: w,
      h: h,
      xy: function (lat, lon) {
        var q = fwd(lat, lon);
        return [cx + (q[0] - o[0]) * s, cy - (q[1] - o[1]) * s];
      },
      ll: function (x, y) {
        var X = (x - cx) / s + o[0], Y = -(y - cy) / s + o[1];
        var r = Math.sqrt(X * X + Y * Y), t = Math.atan2(X, -Y);
        return [(2 * Math.atan(Math.pow(F / r, 1 / n)) - Math.PI / 2) / RAD, c.meridian + t / n / RAD];
      }
    };
  }

  function inside(V, p, m) { return p[0] > m && p[0] < V.w - m && p[1] > m && p[1] < V.h - m; }

  /* ---------- Geometry helpers ---------- */

  function densify(pts, step) {
    var out = [pts[0]];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var k = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / step));
      for (var j = 1; j <= k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
    return out;
  }

  function trace(ctx, V, pts, close) {
    densify(pts, 0.25).forEach(function (p, i) {
      var q = V.xy(p[0], p[1]);
      if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
    });
    if (close) ctx.closePath();
  }

  function poly(ctx, pts, closed) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (closed) ctx.closePath();
  }

  // Chaikin corner cutting, so contours read as drawn rather than computed.
  function smooth(pts, closed, iterations) {
    for (var k = 0; k < iterations; k++) {
      var n = pts.length, out = closed ? [] : [pts[0]];
      for (var i = 0; i < (closed ? n : n - 1); i++) {
        var a = pts[i], b = pts[(i + 1) % n];
        out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
      }
      if (!closed) out.push(pts[n - 1]);
      pts = out;
    }
    return pts;
  }

  function arcLength(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }

  function pointAt(pts, dist) {
    for (var i = 1; i < pts.length; i++) {
      var seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (dist <= seg) {
        var t = seg ? dist / seg : 0;
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      }
      dist -= seg;
    }
    return null;
  }

  /* ---------- Gridded fields and contours (marching squares) ---------- */

  function sample(V, cell, fn, closeEdges) {
    var nx = Math.ceil(V.w / cell) + 1, ny = Math.ceil(V.h / cell) + 1, f = new Float32Array(nx * ny);
    for (var j = 0; j < ny; j++) {
      for (var i = 0; i < nx; i++) {
        var edge = i === 0 || j === 0 || i === nx - 1 || j === ny - 1;
        if (closeEdges && edge) { f[j * nx + i] = -9; continue; }
        var ll = V.ll(i * cell, j * cell);
        f[j * nx + i] = fn(ll[0], ll[1]);
      }
    }
    return { nx: nx, ny: ny, cell: cell, f: f };
  }

  function contour(F, level) {
    var nx = F.nx, ny = F.ny, c = F.cell, f = F.f, segs = [];
    for (var j = 0; j < ny - 1; j++) {
      for (var i = 0; i < nx - 1; i++) {
        var a = f[j * nx + i], b = f[j * nx + i + 1], cc = f[(j + 1) * nx + i + 1], d = f[(j + 1) * nx + i];
        if (a !== a || b !== b || cc !== cc || d !== d) continue; // masked (e.g. land on the SST chart)
        var idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (cc > level ? 2 : 0) | (d > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        var x = i * c, y = j * c;
        var T_ = [x + c * (level - a) / (b - a), y];
        var R = [x + c, y + c * (level - b) / (cc - b)];
        var B = [x + c * (level - d) / (cc - d), y + c];
        var L = [x, y + c * (level - a) / (d - a)];
        switch (idx) {
          case 1: case 14: segs.push([L, B]); break;
          case 2: case 13: segs.push([B, R]); break;
          case 3: case 12: segs.push([L, R]); break;
          case 4: case 11: segs.push([T_, R]); break;
          case 6: case 9: segs.push([T_, B]); break;
          case 7: case 8: segs.push([L, T_]); break;
          case 5: segs.push([L, T_], [B, R]); break;
          case 10: segs.push([T_, R], [L, B]); break;
        }
      }
    }
    return join(segs);
  }

  // Chains marching-squares segments into polylines.
  function join(segs) {
    var ends = {}, used = new Uint8Array(segs.length), lines = [];
    function key(p) { return Math.round(p[0] * 64) + ',' + Math.round(p[1] * 64); }
    segs.forEach(function (s, i) {
      [key(s[0]), key(s[1])].forEach(function (k) { (ends[k] = ends[k] || []).push(i); });
    });
    function grow(from, out) {
      var tip = from;
      for (;;) {
        var list = ends[key(tip)] || [], next = -1;
        for (var n = 0; n < list.length; n++) if (!used[list[n]]) { next = list[n]; break; }
        if (next < 0) return;
        used[next] = 1;
        var s = segs[next];
        tip = key(s[0]) === key(tip) ? s[1] : s[0];
        out.push(tip);
      }
    }
    for (var i = 0; i < segs.length; i++) {
      if (used[i]) continue;
      used[i] = 1;
      var fwd = [], back = [];
      grow(segs[i][1], fwd);
      grow(segs[i][0], back);
      var pts = back.reverse().concat([segs[i][0], segs[i][1]], fwd);
      var closed = pts.length > 3 && key(pts[0]) === key(pts[pts.length - 1]);
      if (closed) pts.pop();
      lines.push({ pts: pts, closed: closed });
    }
    return lines;
  }

  /* ---------- Lettering ---------- */

  function text(ctx, s, x, y, font, color, align, halo) {
    ctx.font = font;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    if (halo) {
      ctx.lineJoin = 'round';
      ctx.strokeStyle = T.halo;
      ctx.lineWidth = halo;
      ctx.strokeText(s, x, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
  }

  // Letter-spaced capitals, centred, as on engraved maps.
  function spaced(ctx, s, x, y, font, color, gap) {
    ctx.font = font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var chars = s.split(''), widths = chars.map(function (ch) { return ctx.measureText(ch).width; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + gap * (chars.length - 1), cx = x - total / 2;
    ctx.fillStyle = color;
    chars.forEach(function (ch, i) { ctx.fillText(ch, cx, y); cx += widths[i] + gap; });
  }

  /* ---------- Base map ---------- */

  function bisect(f, lo, hi) {
    for (var i = 0; i < 40; i++) {
      var mid = (lo + hi) / 2;
      if ((f(lo) < 0) === (f(mid) < 0)) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function graticule(ctx, V, step) {
    var lat, lon;
    ctx.save();
    ctx.strokeStyle = ink(0.22);
    ctx.lineWidth = 0.6;
    ctx.setLineDash([1.5, 3]);
    ctx.beginPath();
    for (lat = 10; lat <= 50; lat += step) trace(ctx, V, [[lat, -130], [lat, -50]], false);
    for (lon = -130; lon <= -50; lon += step) trace(ctx, V, [[5, lon], [55, lon]], false);
    ctx.stroke();
    ctx.restore();

    var font = '400 9.5px ' + SANS;
    for (lat = 10; lat <= 50; lat += step) {
      var lx = bisect(function (l) { return V.xy(lat, l)[0] - 6; }, -140, -40);
      var ly = V.xy(lat, lx)[1];
      if (ly > 16 && ly < V.h - 16) text(ctx, lat + '°N', 6, ly - 7, font, ink(0.6), 'left', 3);
    }
    for (lon = -130; lon <= -50; lon += step) {
      var mlat = bisect(function (l) { return V.xy(l, lon)[1] - (V.h - 9); }, 0, 60);
      var mx = V.xy(mlat, lon)[0];
      if (mx > 40 && mx < V.w - 40) text(ctx, Math.abs(lon) + '°W', mx + 4, V.h - 9, font, ink(0.6), 'left', 3);
    }
  }

  function drawBase(ctx, V, spec) {
    // Shorelines are smoothed on screen so the simplified outlines read as drawn, not plotted.
    function shore(pts, closed) { return smooth(pts.map(function (p) { return V.xy(p[0], p[1]); }), closed, 3); }
    var coast = shore(COAST, false);
    var lakes = LAKES.map(function (l) { return shore(l, true); });

    ctx.fillStyle = T.sea;
    ctx.fillRect(0, 0, V.w, V.h);
    ctx.beginPath();
    poly(ctx, coast, false);
    COAST_CLOSE.forEach(function (p) { var q = V.xy(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
    ctx.closePath();
    ctx.fillStyle = T.land;
    ctx.fill();
    ctx.beginPath();
    lakes.forEach(function (l) { poly(ctx, l, true); });
    ctx.fillStyle = T.lake;
    ctx.fill();

    ctx.lineJoin = 'round';
    ctx.beginPath();
    poly(ctx, coast, false);
    ctx.strokeStyle = ink(0.75);
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.beginPath();
    lakes.forEach(function (l) { poly(ctx, l, true); });
    ctx.strokeStyle = ink(0.5);
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.beginPath();
    RIVERS.forEach(function (r) { trace(ctx, V, r, false); });
    ctx.strokeStyle = T.river;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    BORDERS.forEach(function (b) { trace(ctx, V, b, false); });
    ctx.strokeStyle = ink(0.4);
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.setLineDash([8, 3, 2, 3]);
    ctx.beginPath();
    trace(ctx, V, NATIONAL, false);
    ctx.stroke();
    ctx.restore();

    graticule(ctx, V, spec.grat);

    (spec.states || []).forEach(function (s) {
      var p = V.xy(s[1], s[2]);
      if (inside(V, p, 30)) spaced(ctx, s[0], p[0], p[1], '500 9.5px ' + SANS, ink(0.42), 3.2);
    });
    (spec.water || []).forEach(function (s) {
      var p = V.xy(s[1], s[2]);
      if (inside(V, p, 40)) spaced(ctx, s[0], p[0], p[1], 'italic 400 ' + s[3] + 'px ' + SERIF, ink(0.5), 4);
    });
  }

  /* ---------- Weather ---------- */

  function areaPath(loops) {
    var p = new Path2D();
    loops.forEach(function (pts) {
      p.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
      p.closePath();
    });
    return p;
  }

  function hatch(ctx, path, V, slope, gap, color, width) {
    ctx.save();
    ctx.clip(path, 'evenodd');
    ctx.beginPath();
    for (var c = -V.h; c < V.w + V.h; c += gap) {
      if (slope > 0) { ctx.moveTo(c, V.h); ctx.lineTo(c + V.h, 0); } else { ctx.moveTo(c, 0); ctx.lineTo(c + V.h, V.h); }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  }

  function drawRain(ctx, V) {
    var R = sample(V, 4, rain, true);
    var paths = RAIN_LEVELS.map(function (level) {
      return areaPath(contour(R, level).map(function (l) { return smooth(l.pts, true, 2); }));
    });
    hatch(ctx, paths[0], V, 1, 6, ink(0.3), 0.7);
    hatch(ctx, paths[1], V, -1, 6, ink(0.3), 0.7);
    ctx.fillStyle = clay(T === THEMES.night ? 0.1 : 0.16);
    ctx.fill(paths[2], 'evenodd');
    hatch(ctx, paths[2], V, 1, 3, clay(0.6), 0.8);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = ink(0.42);
    ctx.stroke(paths[0]);
    ctx.strokeStyle = ink(0.45);
    ctx.stroke(paths[1]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = clay(0.95);
    ctx.stroke(paths[2]);
  }

  // Contours of a gridded field, labelled where they meet the frame (or at the top of closed loops)
  // with the line broken around each label, as on a hand-drafted chart.
  function drawContours(ctx, V, dpr, F, levels, fmt, avoid) {
    var layer = document.createElement('canvas');
    layer.width = ctx.canvas.width;
    layer.height = ctx.canvas.height;
    var lc = layer.getContext('2d');
    lc.setTransform(dpr, 0, 0, dpr, 0, 0);
    lc.strokeStyle = ink(0.8);
    lc.lineWidth = 1;
    lc.lineJoin = 'round';
    var labels = [];
    levels.forEach(function (level) {
      contour(F, level).forEach(function (line) {
        var pts = smooth(line.pts, line.closed, 2);
        if (arcLength(pts) < 40) return;
        lc.beginPath();
        poly(lc, pts, line.closed);
        lc.stroke();
        var spots = line.closed
          ? [pts.reduce(function (m, p) { return p[1] < m[1] ? p : m; })]
          : [pointAt(pts, 38), pointAt(pts.slice().reverse(), 38)];
        spots.forEach(function (p) { if (p) labels.push({ x: p[0], y: p[1], t: fmt(level) }); });
      });
    });
    var kept = [];
    labels.forEach(function (l) {
      if (!inside(V, [l.x, l.y], 16)) return;
      if ((avoid || []).some(function (q) { return Math.abs(q[0] - l.x) < 40 && Math.abs(q[1] - l.y) < 30; })) return;
      if (kept.some(function (k) { return Math.hypot(k.x - l.x, k.y - l.y) < 64; })) return;
      kept.push(l);
    });
    var font = '500 10px ' + SANS;
    lc.font = font;
    lc.globalCompositeOperation = 'destination-out';
    kept.forEach(function (l) {
      var tw = lc.measureText(l.t).width;
      lc.fillRect(l.x - tw / 2 - 3, l.y - 6.5, tw + 6, 13);
    });
    ctx.drawImage(layer, 0, 0, V.w, V.h);
    kept.forEach(function (l) { text(ctx, l.t, l.x, l.y + 0.5, font, ink(0.85), 'center'); });
  }

  function range(from, to, step) {
    var out = [];
    for (var v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 10) / 10);
    return out;
  }

  function drawFront(ctx, V) {
    var pts = smooth(densify(FRONT, 0.2).map(function (p) { return V.xy(p[0], p[1]); }), false, 2);
    ctx.beginPath();
    poly(ctx, pts, false);
    ctx.strokeStyle = ink(0.9);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = ink(0.9);
    var total = arcLength(pts);
    for (var s = 18, k = 0; s < total - 10; s += 30, k++) {
      var a = pointAt(pts, s - 5), b = pointAt(pts, s + 5);
      if (!a || !b) continue;
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (!inside(V, [mx, my], -8)) continue;
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      dx /= L; dy /= L;
      ctx.beginPath();
      if (k % 2 === 0) {
        // Triangles point to the warm (Gulf) side, semicircles to the cool side.
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(mx - dy * 6.5, my + dx * 6.5);
        ctx.lineTo(b[0], b[1]);
      } else {
        var ang = Math.atan2(dy, dx);
        ctx.arc(mx, my, 4.6, ang, ang + Math.PI, true);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCentres(ctx, V, marks, fn) {
    marks.forEach(function (m) {
      var p = V.xy(m[1][0], m[1][1]);
      if (!inside(V, p, 24)) return;
      text(ctx, m[0], p[0], p[1] - 3, '600 28px ' + SERIF, ink(0.92), 'center', 4);
      text(ctx, String(Math.round(fn(m[1][0], m[1][1]))), p[0], p[1] + 17, '500 10px ' + SANS, ink(0.8), 'center', 3);
    });
  }

  function drawStation(ctx, V, s) {
    var lat = s[0], lon = s[1], p = V.xy(lat, lon), x = p[0], y = p[1], r = 3.4;
    if (x < 28 || x > V.w - 34 || y < 18 || y > V.h - 26) return;

    var wv = surfaceWind(lat, lon), c = Math.cos(lat * RAD);
    var knots = Math.round(Math.min(30, Math.max(5, Math.hypot(wv[0], wv[1]) * 7)) / 5) * 5;
    var q = V.xy(lat - wv[1] * 0.02, lon - wv[0] * 0.02 / c);
    var dx = q[0] - x, dy = q[1] - y, L = Math.hypot(dx, dy) || 1;
    dx /= L; dy /= L;

    ctx.strokeStyle = ink(0.85);
    ctx.fillStyle = ink(0.85);
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    // Barb: shaft toward where the wind blows from, a full feather per 10 kt and a half per 5 kt.
    var ex = x + dx * (r + 20), ey = y + dy * (r + 20), nx = -dy, ny = dx;
    ctx.beginPath();
    ctx.moveTo(x + dx * r, y + dy * r);
    ctx.lineTo(ex, ey);
    var along = 0, left = knots;
    function feather(len) {
      var bx = ex - dx * along, by = ey - dy * along;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + nx * len + dx * len * 0.45, by + ny * len + dy * len * 0.45);
    }
    while (left >= 10) { feather(8.5); left -= 10; along += 3.2; }
    if (left >= 5) { if (!along) along = 3.2; feather(4.5); }
    ctx.stroke();

    // Station circle, shaded for cloud cover.
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = T.land;
    ctx.fill();
    if (s[4]) {
      ctx.beginPath();
      if (s[4] >= 8) ctx.arc(x, y, r, 0, Math.PI * 2);
      else { ctx.moveTo(x, y); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s[4] / 8); ctx.closePath(); }
      ctx.fillStyle = ink(0.85);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    var font = '500 9.5px ' + SANS, col = ink(0.72);
    var code = ('00' + (Math.round(pressure(lat, lon) * 10) % 1000)).slice(-3);
    text(ctx, String(s[2]), x - 6, y - 8, font, col, 'right', 2.5);
    text(ctx, String(s[3]), x - 6, y + 9, font, col, 'right', 2.5);
    text(ctx, code, x + 6, y - 8, font, col, 'left', 2.5);

    // Present weather: two, three or four dots for light, moderate or heavy continuous rain.
    var rr = rain(lat, lon), dots = rr > RAIN_LEVELS[2] ? 4 : rr > RAIN_LEVELS[1] ? 3 : rr > RAIN_LEVELS[0] ? 2 : 0;
    var spots = { 2: [[-15, 0.5], [-10.5, 0.5]], 3: [[-15, 2], [-10.5, 2], [-12.75, -1.6]], 4: [[-15, 0.5], [-10.5, 0.5], [-12.75, -2.6], [-12.75, 3.6]] }[dots] || [];
    ctx.fillStyle = ink(0.85);
    spots.forEach(function (d) { ctx.beginPath(); ctx.arc(x + d[0], y + d[1], 1.15, 0, Math.PI * 2); ctx.fill(); });

    if (s[5]) text(ctx, s[5], x, y + 21, 'italic 400 11.5px ' + SERIF, ink(0.72), 'center', 3);
  }

  function drawAnnotation(ctx, V, note) {
    var core = V.xy(note.lat, note.lon), tx = core[0] + note.dx, ty = core[1] + note.dy;
    if (!inside(V, [tx, ty], 20)) return;
    ctx.beginPath();
    ctx.moveTo(core[0] + note.dx * 0.18, core[1] + note.dy * 0.18);
    ctx.lineTo(tx - Math.sign(note.dx) * 4, ty + 4);
    ctx.strokeStyle = clay(0.9);
    ctx.lineWidth = 0.8;
    ctx.stroke();
    text(ctx, note.text, tx, ty, 'italic 400 15px ' + SERIF, clay(1), note.dx < 0 ? 'right' : 'left', 3.5);
  }

  /* ---------- Places ---------- */

  function drawPlaces(ctx, V, spec) {
    (spec.cities || []).forEach(function (c) {
      var p = V.xy(c[1], c[2]);
      if (!inside(V, p, 12)) return;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.1, 0, Math.PI * 2);
      ctx.fillStyle = ink(0.85);
      ctx.fill();
      // Put the name on the other side of the dot if it would run off the frame.
      var font = '400 11px ' + SANS, dx = c[3];
      ctx.font = font;
      var tw = ctx.measureText(c[0]).width;
      if (dx > 0 && p[0] + dx + tw > V.w - 6) dx = -dx;
      else if (dx < 0 && p[0] + dx - tw < 6) dx = -dx;
      text(ctx, c[0], p[0] + dx, p[1] + c[4], font, ink(0.82), dx < 0 ? 'right' : 'left', 3);
    });
    var h = V.xy(HOME[0], HOME[1]), lab = spec.home;
    if (!lab || !inside(V, h, 10)) return;
    ctx.beginPath();
    ctx.arc(h[0], h[1], 4.6, 0, Math.PI * 2);
    ctx.fillStyle = T.land;
    ctx.fill();
    ctx.strokeStyle = ink(0.95);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(h[0], h[1], 1.8, 0, Math.PI * 2);
    ctx.fillStyle = ink(0.95);
    ctx.fill();
    text(ctx, 'Baton Rouge', h[0] + lab.dx, h[1] + lab.dy, '600 ' + lab.size + 'px ' + SANS, ink(0.95), 'left', 3.5);
    if (lab.sub) text(ctx, lab.sub, h[0] + lab.dx, h[1] + lab.dy + lab.size + 2, '400 11px ' + SANS, ink(0.75), 'left', 3);
  }

  function drawScale(ctx, V, lat, lon) {
    var km = 100, a = V.xy(lat, lon), b = V.xy(lat, lon + km / (111.32 * Math.cos(lat * RAD)));
    var len = Math.hypot(b[0] - a[0], b[1] - a[1]), x0 = V.w - 34 - len, y0 = V.h - 40;
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x0 + len, y0);
    [0, 0.5, 1].forEach(function (t) { ctx.moveTo(x0 + len * t, y0 - (t === 0.5 ? 3 : 5)); ctx.lineTo(x0 + len * t, y0); });
    ctx.strokeStyle = ink(0.85);
    ctx.lineWidth = 1;
    ctx.stroke();
    var font = '400 9.5px ' + SANS;
    text(ctx, '0', x0, y0 + 10, font, ink(0.75), 'center', 3);
    text(ctx, '50', x0 + len / 2, y0 + 10, font, ink(0.75), 'center', 3);
    text(ctx, '100 km', x0 + len, y0 + 10, font, ink(0.75), 'center', 3);
  }

  /* ---------- Chart specs ---------- */

  var GULF_STATES = [['TEXAS', 31.0, -97.6], ['LOUISIANA', 31.6, -92.6], ['MISSISSIPPI', 32.6, -89.75], ['ALABAMA', 32.4, -86.75], ['GEORGIA', 32.2, -83.6], ['FLORIDA', 29.75, -82.75]];

  function framing(w, views) {
    var v = w < 640 ? views.narrow : w < 960 ? (views.mid || views.wide) : views.wide;
    v = Object.assign({ meridian: -95, parallel: 30 }, v);
    return v;
  }

  var SPECS = {
    surface: function (w, view, h) {
      var views = {
        // On phones the chart gets its own window above the title, so Baton Rouge sits about 260 px down.
        hero: { wide: { lat: 30.35, lon: -91.0, fx: 0.68, fy: 0.42, span: 15 }, mid: { lat: 30.35, lon: -91.0, fx: 0.66, fy: 0.36, span: 11 }, narrow: { lat: 30.45, lon: -91.1, fx: 0.58, fy: Math.min(0.4, 260 / h), span: 8.2 } },
        band: { wide: { lat: 30.2, lon: -90.6, fx: 0.7, fy: 0.5, span: 11 }, narrow: { lat: 30.4, lon: -91.0, fx: 0.62, fy: 0.4, span: 7.5 } },
        plate: { wide: { lat: 29.35, lon: -90.4, span: 19 }, mid: { lat: 29.5, lon: -90.6, span: 13.5 }, narrow: { lat: 29.85, lon: -90.9, span: 9.4 } }
      };
      var stations = STATIONS;
      return {
        view: framing(w, views[view] || views.plate),
        grat: 5,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.9, -90.3, 15]],
        cities: [['New Orleans', 29.95, -90.07, 7, 9]],
        home: { dx: 8, dy: 12, size: 12 },
        note: w < 640 ? { lat: 30.62, lon: -90.75, dx: -14, dy: -60, text: 'heaviest rain' } : { lat: 30.62, lon: -90.75, dx: 74, dy: -50, text: 'heaviest rain' },
        wind: surfaceWind,
        draw: function (ctx, V, dpr) {
          drawRain(ctx, V);
          drawContours(ctx, V, dpr, sample(V, 5, pressure, false), range(988, 1032, 4), String,
            stations.map(function (st) { return V.xy(st[0], st[1]); }));
          drawFront(ctx, V);
          drawCentres(ctx, V, [['L', LOW]].concat(HIGHS.map(function (h) { return ['H', h]; })), pressure);
          stations.forEach(function (s) { drawStation(ctx, V, s); });
        }
      };
    },

    upper: function (w, view) {
      var views = {
        alt: { wide: { lat: 29.8, lon: -88.5, fx: 0.66, fy: 0.45, span: 18 }, narrow: { lat: 30.2, lon: -90.0, fx: 0.55, fy: 0.45, span: 10 } },
        main: { wide: { lat: 31.0, lon: -92.0, fx: 0.62, fy: 0.5, span: 22 }, narrow: { lat: 31.0, lon: -92.0, fx: 0.55, fy: 0.45, span: 12 } }
      };
      return {
        view: framing(w, views[view] || views.main),
        grat: 5,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.9, -90.3, 15]],
        home: { dx: 8, dy: 12, size: 12 },
        wind: upperWind,
        draw: function (ctx, V, dpr) {
          drawContours(ctx, V, dpr, sample(V, 6, heights, false), range(540, 600, 6), String);
        }
      };
    },

    sst: function (w) {
      var views = { wide: { lat: 27.2, lon: -89.0, fx: 0.6, fy: 0.5, span: 15 }, narrow: { lat: 27.0, lon: -88.4, fx: 0.5, fy: 0.55, span: 9 } };
      return {
        view: framing(w, views),
        grat: 5,
        states: GULF_STATES,
        home: { dx: 8, dy: 12, size: 12 },
        wind: current,
        draw: function (ctx, V, dpr) {
          drawContours(ctx, V, dpr, sample(V, 6, sst, false), range(20, 30, 1), function (v) { return v + '°'; });
          [['Loop Current', 26.1, -86.9], ['warm eddy', EDDY[0], EDDY[1]]].forEach(function (l) {
            var p = V.xy(l[1], l[2]);
            if (inside(V, p, 40)) text(ctx, l[0], p[0], p[1], 'italic 400 15px ' + SERIF, clay(0.95), 'center', 4);
          });
        }
      };
    },

    locator: function (w) {
      return {
        view: { lat: 30.55, lon: -91.2, span: w < 500 ? 5.6 : 7.2, meridian: -91.2, parallel: 30.5 },
        grat: 1,
        states: [['LOUISIANA', 30.8, -92.6], ['MISSISSIPPI', 32.0, -89.6], ['TEXAS', 31.55, -94.4], ['ARKANSAS', 33.35, -92.3], ['ALABAMA', 31.6, -87.75]],
        water: [['GULF OF MEXICO', 28.75, -91.0, 14]],
        cities: [['New Orleans', 29.95, -90.07, 7, 9], ['Lafayette', 30.22, -92.02, -7, 9], ['Lake Charles', 30.23, -93.22, -7, 9],
          ['Alexandria', 31.31, -92.45, 7, 0], ['Jackson', 32.3, -90.18, 7, 0], ['Mobile', 30.69, -88.04, 7, 0], ['Hattiesburg', 31.33, -89.29, 7, 0]],
        home: { dx: 10, dy: -12, size: 13, sub: 'Louisiana State University' },
        scale: true
      };
    }
  };

  /* ---------- Wind streaks ---------- */

  var STORAGE_KEY = 'lab-flow-paused';
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var STREAK = ['rgba(231,232,228,0.14)', 'rgba(231,232,228,0.28)', 'rgba(231,232,228,0.48)'];

  function storedPause() {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }

  // Short fading streaks carried by the chart's own wind (or current) field, drawn on a layer above it.
  function Flow(chart) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'flow-layer';
    this.canvas.setAttribute('aria-hidden', 'true');
    chart.canvas.parentNode.insertBefore(this.canvas, chart.canvas.nextSibling);
    this.ctx = this.canvas.getContext('2d');
    this.visible = true;
    this.running = false;
    this.paused = storedPause();
    this.vel = [0, 0];
    this.frame = this.frame.bind(this);
  }

  Flow.prototype.setup = function (V, wind) {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(V.w * dpr);
    this.canvas.height = Math.round(V.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = V.w;
    this.h = V.h;

    // Sample the flow once on a coarse screen grid, in pixels, then interpolate.
    var cell = 10, nx = Math.ceil(V.w / cell) + 2, ny = Math.ceil(V.h / cell) + 2;
    var U = new Float32Array(nx * ny), W = new Float32Array(nx * ny), mags = [];
    for (var j = 0; j < ny; j++) {
      for (var i = 0; i < nx; i++) {
        var x = i * cell, y = j * cell, ll = V.ll(x, y), wv = wind(ll[0], ll[1]);
        if (!wv) continue;
        var e = 0.05, q = V.xy(ll[0] + wv[1] * e, ll[1] + wv[0] * e / Math.cos(ll[0] * RAD));
        var k = j * nx + i;
        U[k] = q[0] - x;
        W[k] = q[1] - y;
        mags.push(Math.hypot(U[k], W[k]));
      }
    }
    mags.sort(function (a, b) { return a - b; });
    var ref = mags.length ? mags[Math.floor(mags.length * 0.95)] : 0;
    var scale = ref ? 1.35 / ref : 0; // the brisk end of the flow moves about 1.35 px a frame
    for (var n = 0; n < U.length; n++) { U[n] *= scale; W[n] *= scale; }
    this.grid = { nx: nx, ny: ny, cell: cell, U: U, W: W };

    var count = Math.round(Math.min(1700, Math.max(240, V.w * V.h / 950)));
    this.n = count;
    this.px = new Float32Array(count);
    this.py = new Float32Array(count);
    this.sx = new Float32Array(count);
    this.sy = new Float32Array(count);
    this.age = new Float32Array(count);
    this.life = new Float32Array(count);
    this.bucket = new Uint8Array(count);
    for (var p = 0; p < count; p++) this.spawn(p, true);

    // A few steps up front, so a paused or reduced-motion page still shows the flow.
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (var s = 0; s < 36; s++) { this.step(1); this.draw(); }
  };

  Flow.prototype.velocity = function (x, y, out) {
    var g = this.grid, fx = x / g.cell, fy = y / g.cell, i = Math.floor(fx), j = Math.floor(fy);
    if (i < 0 || j < 0 || i >= g.nx - 1 || j >= g.ny - 1) { out[0] = out[1] = 0; return; }
    var tx = fx - i, ty = fy - j, k = j * g.nx + i;
    out[0] = (g.U[k] * (1 - tx) + g.U[k + 1] * tx) * (1 - ty) + (g.U[k + g.nx] * (1 - tx) + g.U[k + g.nx + 1] * tx) * ty;
    out[1] = (g.W[k] * (1 - tx) + g.W[k + 1] * tx) * (1 - ty) + (g.W[k + g.nx] * (1 - tx) + g.W[k + g.nx + 1] * tx) * ty;
  };

  Flow.prototype.spawn = function (i, initial) {
    for (var tries = 0; tries < 12; tries++) {
      this.px[i] = Math.random() * this.w;
      this.py[i] = Math.random() * this.h;
      this.velocity(this.px[i], this.py[i], this.vel);
      if (Math.hypot(this.vel[0], this.vel[1]) > 0.06) break;
    }
    this.life[i] = 70 + Math.random() * 130;
    this.age[i] = initial ? Math.random() * this.life[i] : 0;
    this.sx[i] = NaN;
  };

  Flow.prototype.step = function (dt) {
    var v = this.vel;
    for (var i = 0; i < this.n; i++) {
      var x = this.px[i], y = this.py[i];
      this.velocity(x, y, v);
      var s = Math.hypot(v[0], v[1]);
      this.sx[i] = x;
      this.sy[i] = y;
      this.px[i] = x + v[0] * dt;
      this.py[i] = y + v[1] * dt;
      this.bucket[i] = s > 1.0 ? 2 : s > 0.5 ? 1 : 0;
      this.age[i] += dt;
      if (this.age[i] > this.life[i] || s < 0.02 || this.px[i] < -4 || this.py[i] < -4 || this.px[i] > this.w + 4 || this.py[i] > this.h + 4) {
        this.spawn(i, false);
      }
    }
  };

  Flow.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'rgba(0,0,0,0.93)';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1;
    for (var b = 0; b < 3; b++) {
      ctx.beginPath();
      for (var i = 0; i < this.n; i++) {
        if (this.bucket[i] !== b || this.sx[i] !== this.sx[i]) continue;
        ctx.moveTo(this.sx[i], this.sy[i]);
        ctx.lineTo(this.px[i], this.py[i]);
      }
      ctx.strokeStyle = STREAK[b];
      ctx.stroke();
    }
  };

  Flow.prototype.frame = function (t) {
    if (!this.running) return;
    var dt = this.last ? Math.min(3, (t - this.last) / 16.67) : 1;
    this.last = t;
    this.step(dt);
    this.draw();
    requestAnimationFrame(this.frame);
  };

  Flow.prototype.update = function () {
    var go = !reduceMotion && !this.paused && this.visible && !document.hidden && !!this.grid;
    if (go && !this.running) {
      this.running = true;
      this.last = 0;
      requestAnimationFrame(this.frame);
    } else if (!go) {
      this.running = false;
    }
  };

  /* ---------- Rendering ---------- */

  function Chart(canvas) {
    this.canvas = canvas;
    this.kind = canvas.getAttribute('data-chart');
    this.view = canvas.getAttribute('data-view') || '';
    this.theme = THEMES[canvas.getAttribute('data-theme')] || THEMES.paper;
    this.size = '';
    this.flow = canvas.hasAttribute('data-flow') ? new Flow(this) : null;
  }

  Chart.prototype.render = function (force) {
    var canvas = this.canvas, w = canvas.clientWidth, h = canvas.clientHeight;
    var make = SPECS[this.kind];
    if (!make || !w || !h || (!force && this.size === w + 'x' + h)) return;
    this.size = w + 'x' + h;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    T = this.theme;
    var spec = make(w, this.view, h);
    var V = makeView(w, h, spec.view);
    drawBase(ctx, V, spec);
    if (spec.draw) spec.draw(ctx, V, dpr);
    drawPlaces(ctx, V, spec);
    if (spec.note) drawAnnotation(ctx, V, spec.note);
    if (spec.scale) drawScale(ctx, V, spec.view.lat, spec.view.lon);
    if (this.flow && spec.wind) {
      this.flow.setup(V, spec.wind);
      this.flow.update();
    }
  };

  var charts = Array.prototype.map.call(document.querySelectorAll('canvas[data-chart]'), function (c) { return new Chart(c); });
  if (!charts.length) return;
  var flows = charts.map(function (c) { return c.flow; }).filter(Boolean);

  function renderAll(force) { charts.forEach(function (c) { c.render(force); }); }
  renderAll(true);

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; renderAll(false); });
  }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(schedule);
    charts.forEach(function (c) { ro.observe(c.canvas); });
  } else {
    window.addEventListener('resize', schedule);
  }

  // Redraw once the web fonts used for lettering have arrived.
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('500 10px "Libre Franklin"'),
      document.fonts.load('600 12px "Libre Franklin"'),
      document.fonts.load('italic 400 14px Newsreader'),
      document.fonts.load('600 28px Newsreader')
    ]).then(function () { renderAll(true); }, function () {});
  }

  /* ---------- Motion controls ---------- */

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        flows.forEach(function (f) {
          if (f.canvas === entry.target) { f.visible = entry.isIntersecting; f.update(); }
        });
      });
    });
    flows.forEach(function (f) { io.observe(f.canvas); });
  }
  document.addEventListener('visibilitychange', function () { flows.forEach(function (f) { f.update(); }); });

  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-flow-toggle]'));
  function showPaused(p) {
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', p ? 'true' : 'false');
      var label = btn.querySelector('.label');
      if (label) label.textContent = p ? 'Resume motion' : 'Pause motion';
    });
  }
  if (reduceMotion || !flows.length) {
    toggles.forEach(function (btn) { btn.hidden = true; });
  } else {
    showPaused(storedPause());
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('aria-pressed') !== 'true';
        try { localStorage.setItem(STORAGE_KEY, p ? '1' : '0'); } catch (e) { /* private mode */ }
        flows.forEach(function (f) { f.paused = p; f.update(); });
        showPaused(p);
      });
    });
  }
})();
