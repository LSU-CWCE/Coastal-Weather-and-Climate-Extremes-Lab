/* ==========================================================================
   Charts drawn in the manner of a printed daily weather map.

   data-chart  "surface"  after the August 2016 Louisiana flood: isobars, the low's
                          track, storm-total rain, and the moisture flowing in
               "upper"    500-hPa heights, with the jet stream shaded by wind speed
               "ensemble" a spaghetti plot of 500-hPa contours from many simulations
               "hurricane" Hurricane Ida (2021): the best track and the storm at landfall
               "sst"      sea-surface temperature, with the Loop Current
               "locator"  south Louisiana, for the contact page
   data-theme  "paper" (ink on paper, the default) or "night" (light ink on dark)
   data-view   which framing to use: "hero", "band", "alt", or the default
   data-flow   if present, fine streaks drift through the chart's own flow:
               moisture transport on the surface chart, winds aloft, or ocean
               currents on the SST chart; on the ensemble chart, pulses run
               along each member's contours

   The weather and ocean fields are drawn for illustration, not taken from
   observed or model data; the surface chart follows the 2016 flood only
   approximately, and Ida's track is the National Hurricane Center's best track.
   Coastlines, borders and depths are simplified.
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
    [[31.0, -91.6], [31.3, -92.4], [31.8, -93.0], [32.5, -93.75], [33.0, -94.0], [33.55, -94.04]], // Red
    [[31.25, -90.83], [30.95, -90.92], [30.7, -90.93], [30.5, -90.97], [30.38, -90.88], [30.32, -90.7], [30.3, -90.58]] // Amite, which flooded in 2016
  ];

  // The 200-m depth contour, roughly the edge of the continental shelf.
  var SHELF = [
    [24.0, -97.3], [25.0, -96.9], [26.0, -96.6], [27.0, -96.3], [27.6, -95.6], [27.85, -94.5], [27.9, -93.5],
    [28.0, -92.5], [28.2, -91.5], [28.5, -90.6], [28.8, -89.9], [28.9, -89.3], [29.2, -88.7], [29.5, -88.1],
    [29.75, -87.4], [29.6, -86.8], [29.3, -86.2], [28.8, -85.6], [28.0, -85.0], [27.0, -84.4], [26.0, -83.9],
    [25.0, -83.3], [24.4, -82.6], [24.3, -81.6]
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

  // Surface: after the August 2016 Louisiana flood. A weak low crept west from the Alabama coast toward
  // northwest Louisiana (11–13 August) while a plume of Gulf moisture fed it from the south. More than
  // 20 in of rain fell around Baton Rouge, and 31.39 in at Watson. Positions and totals are approximate.
  var LOW = [30.95, -91.35];
  var TRACK = [[30.45, -87.9], [30.7, -89.2], [30.9, -90.5], LOW, [31.12, -92.05]];
  var HIGHS = [[28.6, -82.2]];
  var JET = [[25.6, -88.0], [27.2, -88.8], [28.7, -89.6], [29.7, -90.25], [30.4, -90.8], [30.8, -91.2]]; // the moist inflow
  var WATSON = [30.576, -90.953];

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
    var d = pathDist(TRACK, lat, lon);
    return 1013 + 0.18 * (lat - 30)
      - 5.5 * bump(lat, lon, LOW[0], LOW[1], 1.1, 2.3)
      - 2.5 * Math.exp(-d * d / 0.5) * bump(lat, lon, 30.9, -90.6, 1.5, 3.5) // a trough along the track
      + 5.5 * bump(lat, lon, HIGHS[0][0], HIGHS[0][1], 3.4, 5);
  }

  // Storm-total rain in inches, 11–14 August, shaped to the reported totals.
  function stormTotal(lat, lon) {
    var r = 9.5 * bump(lat, lon, 30.58, -90.95, 0.12, 0.18) // the core near Watson
      + 14 * bump(lat, lon, 30.52, -90.85, 0.28, 0.42) // Baton Rouge, Denham Springs, Livingston
      + 8 * bump(lat, lon, 30.2, -92.0, 0.3, 0.5) // Acadiana, from the rain that moved west on the 13th
      + 6.5 * bump(lat, lon, 31.15, -90.4, 0.38, 0.5) // southwest Mississippi
      + 7 * bump(lat, lon, 30.45, -91.3, 0.85, 1.9); // the wider rain shield
    return r * (1 + 0.07 * Math.sin(lat * 7.3 + lon * 4.1 + 0.6) * Math.sin(lat * 5.1 - lon * 6.7 + 1.3));
  }
  var ISOHYETS = [5, 10, 15, 20, 25];

  // 500-hPa geopotential height (dam): a trough digging into the lower Mississippi Valley and a ridge
  // off the Southeast coast, with the jet stream along the tightest gradient.
  function jetAxis(lon) {
    return 36 - 5 * Math.exp(-Math.pow((lon + 90) / 7, 2)) + 2 * Math.exp(-Math.pow((lon + 76) / 8, 2));
  }
  function heights(lat, lon) {
    return 586 - 2.2 * (lat - 30)
      - 9 * Math.tanh((lat - jetAxis(lon)) / 1.8)
      - 5 * bump(lat, lon, 34, -90, 3, 3.5)
      + 3 * bump(lat, lon, 29, -76, 4, 6);
  }
  var TROUGH = [[40.5, -91.6], [36.5, -90.8], [33, -90.2], [30.4, -89.8]];

  // Ensemble members: the same pattern with errors that grow downstream, as forecasts drift apart.
  function seeded(n) {
    return function () {
      n = (n + 0x6d2b79f5) | 0;
      var t = Math.imul(n ^ (n >>> 15), 1 | n);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function member(r) {
    var a = r() - 0.5, b = r() - 0.5, c = r() - 0.5, p = r() * 6.283, q = r() * 6.283;
    return function (lat, lon) {
      var grow = 0.12 + 0.88 * Math.max(0, Math.min(1, (lon + 112) / 36));
      return heights(lat, lon + 5 * c * grow) + grow * (9 * a * Math.sin(lon * 0.21 + p) + 6 * b * Math.sin(lat * 0.45 + lon * 0.12 + q));
    };
  }
  var MEMBERS = [];
  for (var mi = 0; mi < 20; mi++) MEMBERS.push(member(seeded(mi + 7)));

  // Hurricane Ida, 2021: the NHC best track (HURDAT2) every 6 hours, with landfall at Port Fourchon.
  // [lat, lon, wind (kt), pressure (hPa), day of August, hour UTC, landfall]
  var IDA = [
    [16.5, -78.9, 30, 1006, 26, 12], [17.4, -79.5, 35, 1006, 26, 18], [18.3, -80.2, 40, 1004, 27, 0], [19.4, -80.9, 45, 1002, 27, 6],
    [20.4, -81.7, 55, 996, 27, 12], [21.5, -82.6, 70, 987, 27, 18], [22.6, -83.5, 70, 989, 28, 0], [23.5, -84.7, 70, 987, 28, 6],
    [24.4, -85.7, 70, 986, 28, 12], [25.6, -86.6, 80, 976, 28, 18], [26.7, -87.6, 90, 967, 29, 0], [27.6, -88.7, 115, 950, 29, 6],
    [28.5, -89.6, 130, 929, 29, 12], [29.1, -90.2, 130, 931, 29, 16.9, true], [29.2, -90.4, 125, 932, 29, 18], [29.9, -90.6, 105, 944, 30, 0],
    [30.6, -90.8, 65, 978, 30, 6], [31.5, -90.9, 40, 992, 30, 12], [32.2, -90.5, 35, 996, 30, 18], [33.0, -90.0, 30, 996, 31, 0],
    [33.8, -89.4, 25, 996, 31, 6]
  ];
  var EYE = [29.1, -90.2];

  // Distance from the eye (degrees, longitude scaled), direction, and the east and north offsets.
  function polar(lat, lon) {
    var x = (lon - EYE[1]) * Math.cos(EYE[0] * RAD), y = lat - EYE[0];
    return [Math.hypot(x, y) + 1e-6, Math.atan2(y, x), x, y];
  }
  // Holland's profile: 931 hPa in the eye, filling out to the surroundings. The storm's size is illustrative.
  function stormPressure(lat, lon) {
    var r = polar(lat, lon)[0], env = 1013 + 0.25 * (lat - 28) + 3 * bump(lat, lon, 28, -80, 5, 7);
    return 931 + (env - 931) * Math.exp(-Math.pow(0.32 / r, 1.25));
  }
  // Winds turning anticlockwise and in toward the eye, strongest at the eyewall, carried north-northwest.
  function stormWind(lat, lon) {
    var P = polar(lat, lon), r = P[0], s = Math.pow(0.32 / r, 1.25), v = Math.sqrt(s * Math.exp(1 - s));
    var ex = P[2] / r, ey = P[3] / r, a = 22 * RAD;
    return [v * (-ey * Math.cos(a) - ex * Math.sin(a)) - 0.06, v * (ex * Math.cos(a) - ey * Math.sin(a)) + 0.22];
  }
  // The eyewall and two spiral bands, heaviest east and north of the eye.
  function stormRain(lat, lon) {
    var P = polar(lat, lon), r = P[0], th = P[1];
    var eyewall = Math.exp(-Math.pow((r - 0.42) / 0.13, 2));
    var band = Math.pow(0.5 + 0.5 * Math.cos(2 * (Math.log(r / 0.4) / 0.42 + th)), 6);
    var reach = Math.exp(-r / 1.6) * Math.min(1, Math.max(0, (r - 0.55) / 0.35));
    return 1.25 * eyewall + 1.1 * band * reach * (1 + 0.45 * Math.cos(th - 0.6));
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

  // A southerly low-level jet along the inflow, strongest over the shelf and easing into the low.
  function jet(lat, lon) {
    var c = Math.cos(lat * RAD), px = lon * c, best = Infinity, dir = [0, 1], at = 0, total = 0;
    for (var i = 0; i < JET.length - 1; i++) {
      var ax = JET[i][1] * c, ay = JET[i][0], dx = JET[i + 1][1] * c - ax, dy = JET[i + 1][0] - ay, L = Math.hypot(dx, dy);
      var t = Math.max(0, Math.min(1, ((px - ax) * dx + (lat - ay) * dy) / (L * L)));
      var ex = ax + t * dx - px, ey = ay + t * dy - lat, d2 = ex * ex + ey * ey;
      if (d2 < best) { best = d2; dir = [dx / L, dy / L]; at = total + t * L; }
      total += L;
    }
    var s = 3 * Math.exp(-best / 1.2) * (0.35 + 0.65 * Math.sin(Math.PI * at / total));
    return [dir[0] * s, dir[1] * s];
  }

  // Moisture transport: the low-level flow weighted by how much water vapour it carries,
  // most over the warm Gulf and in the plume, less inland.
  function moistureFlow(lat, lon) {
    var w = surfaceWind(lat, lon), j = jet(lat, lon), d = pathDist(JET, lat, lon);
    var q = Math.max(0.3, Math.min(1, 1.25 - 0.17 * (lat - 27))) + 0.6 * Math.exp(-d * d / 1.6);
    return [(w[0] + j[0]) * q, (w[1] + j[1]) * q];
  }
  function upperWind(lat, lon) { return alongContours(heights, lat, lon, 0); }

  // Wind speed aloft, scaled so the core of the jet is about 110 kt (illustrative).
  var JET_MAX = (function () {
    var m = 0;
    for (var la = 22; la <= 48; la += 0.5) {
      for (var lo = -120; lo <= -70; lo += 0.5) { var w = upperWind(la, lo); m = Math.max(m, Math.hypot(w[0], w[1])); }
    }
    return m;
  })();
  function jetSpeed(lat, lon) { var w = upperWind(lat, lon); return Math.hypot(w[0], w[1]) / JET_MAX * 110; }
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

  // How far a point is from the quiet area kept for the page's own text: 0 inside it, 1 well clear.
  // The area covers the text column and, for lettering only, the strips under the header and footer.
  function calm(V, x, y, column) {
    var q = V.quiet;
    if (!q) return 1;
    if (!column && (y < q.top || y > q.bottom)) return 0;
    var t = Math.max(0, Math.min(1, (x - q.x) / q.fade));
    return t * t * (3 - 2 * t);
  }
  function clear(V, p) { return calm(V, p[0], p[1]) > 0.5; }

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

    var look = spec.base || {};
    ctx.fillStyle = T.sea;
    ctx.fillRect(0, 0, V.w, V.h);
    if (look.shelf) {
      // Shallow water over the shelf a shade lighter than the deep Gulf; the land is filled over it.
      ctx.beginPath();
      trace(ctx, V, SHELF.concat([[36, -81.6], [36, -97.3]]), true);
      ctx.fillStyle = look.shelf;
      ctx.fill();
    }
    ctx.beginPath();
    poly(ctx, coast, false);
    COAST_CLOSE.forEach(function (p) { var q = V.xy(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
    ctx.closePath();
    ctx.fillStyle = look.land || T.land;
    ctx.fill();
    if (look.shelf) {
      ctx.save();
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      trace(ctx, V, SHELF, false);
      ctx.strokeStyle = ink(0.32);
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    lakes.forEach(function (l) { poly(ctx, l, true); });
    ctx.fillStyle = look.lake || T.lake;
    ctx.fill();

    ctx.lineJoin = 'round';
    ctx.beginPath();
    poly(ctx, coast, false);
    ctx.strokeStyle = ink(look.coast || 0.75);
    ctx.lineWidth = look.coastWidth || 0.9;
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
      if (inside(V, p, 30) && clear(V, p)) spaced(ctx, s[0], p[0], p[1], '500 9.5px ' + SANS, ink(0.42), 3.2);
    });
    (spec.water || []).forEach(function (s) {
      var p = V.xy(s[1], s[2]);
      if (inside(V, p, 40) && clear(V, p)) spaced(ctx, s[0], p[0], p[1], 'italic 400 ' + s[3] + 'px ' + SERIF, ink(0.5), 4);
    });
    (spec.labels || []).forEach(function (s) {
      var p = V.xy(s[1], s[2]);
      if (inside(V, p, 30) && clear(V, p)) text(ctx, s[0], p[0], p[1], 'italic 400 ' + s[3] + 'px ' + SERIF, ink(0.6), 'center', 3);
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

  // Storm-total isohyets, tinted more deeply with each step and turning to clay where the totals
  // pass 15 in. Labels run in a ladder along a line north from the wettest point.
  function drawRainTotals(ctx, V) {
    var R = sample(V, 4, stormTotal, true);
    var loops = ISOHYETS.map(function (level) {
      return contour(R, level).map(function (l) { return smooth(l.pts, true, 2); }).filter(function (pts) { return arcLength(pts) > 30; });
    });
    var fills = [ink(0.03), ink(0.04), clay(0.07), clay(0.1), clay(0.14)];
    var lines = [ink(0.4), ink(0.5), clay(0.6), clay(0.8), clay(0.95)];
    loops.forEach(function (ls, k) {
      var path = areaPath(ls);
      ctx.fillStyle = fills[k];
      ctx.fill(path, 'evenodd');
      if (k === loops.length - 1) hatch(ctx, path, V, 1, 3, clay(0.45), 0.7);
      ctx.save();
      if (k === 0) ctx.setLineDash([3, 3]);
      ctx.strokeStyle = lines[k];
      ctx.lineWidth = k > 2 ? 1 : 0.8;
      ctx.stroke(path);
      ctx.restore();
    });

    var core = V.xy(WATSON[0], WATSON[1]), last = -Infinity, font = '500 9.5px ' + SANS;
    loops.forEach(function (ls, k) {
      // Where this isohyet crosses the line running up the screen from the core.
      var y = null;
      ls.forEach(function (pts) {
        for (var i = 0; i < pts.length; i++) {
          var a = pts[i], b = pts[(i + 1) % pts.length];
          if ((a[0] - core[0]) * (b[0] - core[0]) > 0 || a[0] === b[0]) continue;
          var yy = a[1] + (b[1] - a[1]) * (core[0] - a[0]) / (b[0] - a[0]);
          if (yy < core[1] && (y === null || yy > y)) y = yy;
        }
      });
      if (y === null) return;
      var p = [core[0], y];
      if (!inside(V, p, 16) || !clear(V, p) || Math.abs(last - y) < 13) return;
      last = y;
      text(ctx, ISOHYETS[k] + (k === 0 ? ' in' : ''), p[0], p[1], font, k > 1 ? clay(1) : ink(0.85), 'center', 3);
    });

    // The largest total, at Watson.
    if (inside(V, core, 10)) {
      ctx.beginPath();
      ctx.moveTo(core[0] - 3.5, core[1] - 3.5); ctx.lineTo(core[0] + 3.5, core[1] + 3.5);
      ctx.moveTo(core[0] + 3.5, core[1] - 3.5); ctx.lineTo(core[0] - 3.5, core[1] + 3.5);
      ctx.strokeStyle = clay(1);
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
  }

  // Isotachs of the jet, dashed, tinted toward its core, each labelled at the top of its loop.
  function drawIsotachs(ctx, V) {
    var R = sample(V, 5, jetSpeed, true), levels = [50, 70, 90];
    var fills = [ink(0.025), clay(0.05), clay(0.1)], lines = [ink(0.32), clay(0.5), clay(0.8)];
    levels.forEach(function (level, k) {
      var loops = contour(R, level).map(function (l) { return smooth(l.pts, true, 2); }).filter(function (pts) { return arcLength(pts) > 40; });
      var path = areaPath(loops);
      ctx.fillStyle = fills[k];
      ctx.fill(path, 'evenodd');
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = lines[k];
      ctx.lineWidth = 0.9;
      ctx.stroke(path);
      ctx.restore();
      // Label each loop where it passes nearest the open middle of the chart.
      var tx = V.w * 0.8, ty = V.h * 0.45;
      loops.forEach(function (pts) {
        var best = null, bd = Infinity;
        pts.forEach(function (p) {
          var d = Math.hypot(p[0] - tx, p[1] - ty);
          if (d < bd && inside(V, p, 24) && clear(V, p)) { best = p; bd = d; }
        });
        if (best) text(ctx, level + ' kt', best[0], best[1], '500 9.5px ' + SANS, k ? clay(1) : ink(0.8), 'center', 3);
      });
    });
  }

  // A trough axis, as a heavy dashed line.
  function drawAxis(ctx, V, pts, label) {
    var line = smooth(densify(pts, 0.2).map(function (p) { return V.xy(p[0], p[1]); }), false, 2);
    ctx.save();
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    poly(ctx, line, false);
    ctx.strokeStyle = ink(0.8);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    // Label it a little below the middle of the frame, beside the line.
    var at = null;
    line.forEach(function (p) { if (inside(V, p, 20) && clear(V, p) && (!at || Math.abs(p[1] - V.h * 0.62) < Math.abs(at[1] - V.h * 0.62))) at = p; });
    if (at) text(ctx, label, at[0] + 10, at[1], 'italic 400 14px ' + SERIF, ink(0.8), 'left', 3);
  }

  // Spaghetti: one contour level from every member, thin, with one member in clay and the mean in bold.
  // Returns the members' lines, in pixels, for the pulses that run along them.
  function drawSpaghetti(ctx, V, dpr, levels) {
    var lines = [];
    MEMBERS.forEach(function (fn, k) {
      var F = sample(V, 6, fn, false);
      levels.forEach(function (level) {
        contour(F, level).forEach(function (line) {
          var pts = smooth(line.pts, line.closed, 2);
          if (arcLength(pts) < 40) return;
          ctx.beginPath();
          poly(ctx, pts, line.closed);
          ctx.strokeStyle = k === 0 ? clay(0.9) : ink(0.3);
          ctx.lineWidth = k === 0 ? 1.1 : 0.7;
          ctx.stroke();
          lines.push({ pts: pts, accent: k === 0 });
        });
      });
    });
    drawContours(ctx, V, dpr, sample(V, 6, heights, false), levels, String);
    return lines;
  }

  // Rain areas hatched in two directions, with the heaviest in clay, as on a printed chart.
  function drawHatched(ctx, V, fn, levels) {
    var R = sample(V, 4, fn, true);
    var paths = levels.map(function (level) {
      return areaPath(contour(R, level).map(function (l) { return smooth(l.pts, true, 2); }));
    });
    hatch(ctx, paths[0], V, 1, 6, ink(0.32), 0.7);
    hatch(ctx, paths[1], V, -1, 6, ink(0.32), 0.7);
    ctx.fillStyle = clay(0.12);
    ctx.fill(paths[2], 'evenodd');
    hatch(ctx, paths[2], V, 1, 3, clay(0.55), 0.8);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = ink(0.4);
    ctx.stroke(paths[0]);
    ctx.stroke(paths[1]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = clay(0.9);
    ctx.stroke(paths[2]);
  }

  // The symbol for a tropical cyclone: two arms turning anticlockwise, as in the Northern Hemisphere,
  // round a filled circle for a hurricane or an open one for a tropical storm; a depression has no arms.
  function cycloneSymbol(ctx, x, y, r, kind, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.3;
    if (kind !== 'TD') {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y - 2.4 * r, x + 1.9 * r, y - 2.1 * r);
      ctx.moveTo(x, y + r);
      ctx.quadraticCurveTo(x, y + 2.4 * r, x - 1.9 * r, y + 2.1 * r);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = kind === 'HU' ? color : T.land;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // A best track: the path, a symbol every 6 hours (clay once the storm is a major hurricane)
  // and the date at 00 UTC.
  function drawBestTrack(ctx, V, track) {
    var pts = track.map(function (p) { return V.xy(p[0], p[1]); });
    ctx.beginPath();
    poly(ctx, smooth(pts, false, 2), false);
    ctx.strokeStyle = ink(0.7);
    ctx.lineWidth = 1.1;
    ctx.stroke();
    track.forEach(function (p, i) {
      var q = pts[i];
      if (!inside(V, q, 8) || calm(V, q[0], q[1], true) < 0.5) return;
      var kind = p[2] >= 64 ? 'HU' : p[2] >= 34 ? 'TS' : 'TD';
      cycloneSymbol(ctx, q[0], q[1], kind === 'HU' ? 4.2 : 3.4, kind, p[2] >= 96 ? clay(1) : ink(0.9));
      if (p[5] === 0 && clear(V, q)) text(ctx, p[4] + ' Aug', q[0] + 12, q[1] + 1, '500 10px ' + SANS, ink(0.8), 'left', 3);
    });
  }

  // The low's path: dashed, ending in an arrowhead to show which way it drifted.
  function drawTrack(ctx, V) {
    var pts = smooth(densify(TRACK, 0.2).map(function (p) { return V.xy(p[0], p[1]); }), false, 3);
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    poly(ctx, pts, false);
    ctx.strokeStyle = ink(0.75);
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();
    var b = pts[pts.length - 1], a = pointAt(pts.slice().reverse(), 9);
    if (!a || !inside(V, b, -10)) return;
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    dx /= L; dy /= L;
    ctx.beginPath();
    ctx.moveTo(b[0] + dx * 3, b[1] + dy * 3);
    ctx.lineTo(b[0] - dx * 7 - dy * 4, b[1] - dy * 7 + dx * 4);
    ctx.lineTo(b[0] - dx * 7 + dy * 4, b[1] - dy * 7 - dx * 4);
    ctx.closePath();
    ctx.fillStyle = ink(0.75);
    ctx.fill();
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
      if (!inside(V, [l.x, l.y], 16) || !clear(V, [l.x, l.y])) return;
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

  function drawCentres(ctx, V, marks, fn) {
    marks.forEach(function (m) {
      var p = V.xy(m[1][0], m[1][1]);
      if (!inside(V, p, 24) || !clear(V, p)) return;
      text(ctx, m[0], p[0], p[1] - 3, '600 28px ' + SERIF, ink(0.92), 'center', 4);
      text(ctx, String(Math.round(fn(m[1][0], m[1][1]))), p[0], p[1] + 17, '500 10px ' + SANS, ink(0.8), 'center', 3);
    });
  }

  function drawAnnotation(ctx, V, note) {
    var core = V.xy(note.lat, note.lon), tx = core[0] + note.dx, ty = core[1] + note.dy;
    if (!inside(V, [tx, ty], 20) || !clear(V, [tx, ty])) return;
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
      if (!inside(V, p, 12) || !clear(V, p)) return;
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
    if (!lab || !inside(V, h, 10) || !clear(V, h)) return;
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

  // The night charts share one base: land a shade above the sea, a clear coastline, the shelf marked.
  var NIGHT_BASE = { land: 'rgb(21,30,38)', lake: 'rgb(18,25,30)', coast: 1.05, coastWidth: 1.15, shelf: 'rgba(163,186,182,0.045)' };

  var GULF_STATES = [['TEXAS', 31.0, -97.6], ['LOUISIANA', 31.6, -92.6], ['MISSISSIPPI', 32.6, -89.75], ['ALABAMA', 32.4, -86.75], ['GEORGIA', 32.2, -83.6], ['FLORIDA', 29.75, -82.75]];

  function framing(w, views) {
    var v = w < 640 ? views.narrow : w < 960 ? (views.mid || views.wide) : views.wide;
    v = Object.assign({ meridian: -95, parallel: 30 }, v);
    return v;
  }

  var SPECS = {
    surface: function (w, view, h) {
      var views = {
        // On tablets the storm sits above the title; on phones the chart gets its own window there,
        // with Baton Rouge about 270 px down.
        hero: { wide: { lat: 30.3, lon: -91.0, fx: 0.7, fy: 0.4, span: 11.5 }, mid: { lat: 30.4, lon: -91.0, fx: 0.72, fy: 0.2, span: 8 }, narrow: { lat: 30.5, lon: -91.0, fx: 0.56, fy: Math.min(0.42, 270 / h), span: 5.6 } },
        plate: { wide: { lat: 29.35, lon: -90.4, span: 19 }, mid: { lat: 29.5, lon: -90.6, span: 13.5 }, narrow: { lat: 29.85, lon: -90.9, span: 9.4 } }
      };
      var narrow = w < 640;
      return {
        view: framing(w, views[view] || views.plate),
        grat: 5,
        base: NIGHT_BASE,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.9, -90.3, 15]],
        labels: narrow ? [] : [['moist inflow from the Gulf', 27.9, -91.0, 13], ['shelf edge, 200 m', 29.25, -87.75, 10.5]],
        cities: narrow ? [['New Orleans', 29.95, -90.07, 7, 9]] : [['New Orleans', 29.95, -90.07, 7, 9], ['Lafayette', 30.22, -92.02, -7, 9]],
        home: { dx: 8, dy: 12, size: 12 },
        note: { lat: WATSON[0], lon: WATSON[1], dx: narrow ? -46 : 74, dy: narrow ? 44 : -50, text: '31.39 in at Watson' },
        wind: moistureFlow,
        flow: { focus: true, trail: 0.955 },
        draw: function (ctx, V, dpr) {
          drawRainTotals(ctx, V);
          // Keep isobar labels off the state names.
          var names = [];
          GULF_STATES.forEach(function (st) { var p = V.xy(st[1], st[2]); names.push(p, [p[0] - 36, p[1]], [p[0] + 36, p[1]]); });
          drawContours(ctx, V, dpr, sample(V, 5, pressure, false), range(996, 1024, 2), String, names);
          drawTrack(ctx, V);
          drawCentres(ctx, V, [['L', LOW]].concat(HIGHS.map(function (h) { return ['H', h]; })), pressure);
        }
      };
    },

    upper: function (w) {
      var views = { wide: { lat: 33.5, lon: -91.0, fx: 0.64, fy: 0.5, span: 28 }, narrow: { lat: 32.8, lon: -92.0, fx: 0.55, fy: 0.45, span: 15 } };
      return {
        view: framing(w, views),
        grat: 5,
        base: NIGHT_BASE,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.9, -90.3, 15]],
        home: { dx: 8, dy: 12, size: 12 },
        wind: upperWind,
        flow: { focus: true, trail: 0.95 },
        draw: function (ctx, V, dpr) {
          drawIsotachs(ctx, V);
          drawContours(ctx, V, dpr, sample(V, 6, heights, false), range(540, 600, 6), String);
          drawAxis(ctx, V, TROUGH, 'trough');
        }
      };
    },

    ensemble: function (w) {
      var views = { wide: { lat: 33.5, lon: -93.0, fx: 0.6, fy: 0.5, span: 34 }, narrow: { lat: 33.0, lon: -90.5, fx: 0.5, fy: 0.45, span: 17 } };
      return {
        view: framing(w, views),
        grat: 5,
        base: NIGHT_BASE,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.4, -90.3, 15]],
        home: { dx: 8, dy: 12, size: 12 },
        flow: { trail: 0.94 },
        draw: function (ctx, V, dpr) { this.paths = drawSpaghetti(ctx, V, dpr, [576, 588]); }
      };
    },

    hurricane: function (w) {
      var views = { wide: { lat: 29.1, lon: -88.9, fx: 0.64, fy: 0.6, span: 20 }, narrow: { lat: 29.4, lon: -90.2, fx: 0.7, fy: 0.32, span: 9 } };
      return {
        view: framing(w, views),
        grat: 5,
        base: NIGHT_BASE,
        states: GULF_STATES,
        water: [['GULF OF MEXICO', 26.6, -92.6, 15]],
        home: { dx: 8, dy: -12, size: 12 },
        note: { lat: EYE[0], lon: EYE[1], dx: w < 640 ? 30 : 80, dy: w < 640 ? 56 : 46, text: 'Ida at landfall, 29 Aug: 130 kt, 931 hPa' },
        wind: stormWind,
        flow: { focus: true, trail: 0.95 },
        draw: function (ctx, V, dpr) {
          drawHatched(ctx, V, stormRain, [0.3, 0.6, 1.0]);
          drawContours(ctx, V, dpr, sample(V, 4, stormPressure, false), range(980, 1004, 4), String,
            [0.3, 0.7, 1.1].map(function (d) { return V.xy(HOME[0] + 0.1, HOME[1] + d); }));
          drawBestTrack(ctx, V, IDA);
        }
      };
    },

    sst: function (w) {
      var views = { wide: { lat: 27.0, lon: -88.0, fx: 0.62, fy: 0.72, span: 21 }, narrow: { lat: 27.0, lon: -88.4, fx: 0.5, fy: 0.55, span: 9 } };
      return {
        view: framing(w, views),
        grat: 5,
        base: NIGHT_BASE,
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
  var STREAK_FOCUS = ['rgba(231,232,228,0.1)', 'rgba(231,232,228,0.2)', 'rgba(231,232,228,0.34)']; // longer trails, so a little fainter

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

  Flow.prototype.size = function (V, opts) {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(V.w * dpr);
    this.canvas.height = Math.round(V.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = V.w;
    this.h = V.h;
    this.V = V;
    this.fade = 'rgba(0,0,0,' + ((opts && opts.trail) || 0.93) + ')';
  };

  Flow.prototype.setup = function (V, wind, opts) {
    opts = opts || {};
    this.size(V, opts);
    this.paths = null;
    this.focus = !!opts.focus;
    this.colors = this.focus ? STREAK_FOCUS : STREAK;

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
    var ok = false;
    for (var tries = 0; tries < 24 && !ok; tries++) {
      this.px[i] = Math.random() * this.w;
      this.py[i] = Math.random() * this.h;
      this.velocity(this.px[i], this.py[i], this.vel);
      var s = Math.hypot(this.vel[0], this.vel[1]);
      // With focus, streaks gather where the flow is strong; none start in the quiet area.
      var keep = s > 0.06 ? (this.focus ? Math.min(1, 0.04 + s * s / 1.4) : 1) * calm(this.V, this.px[i], 0, true) : 0;
      ok = Math.random() < keep;
    }
    // A streak that found no good place waits for the next frame to try again.
    this.life[i] = ok ? 70 + Math.random() * 130 : 0;
    this.age[i] = initial ? Math.random() * this.life[i] : 0;
    this.sx[i] = NaN;
  };

  // Pulses that run along fixed lines rather than through a field: on the ensemble chart they travel
  // west to east along each member's contours, as the flow aloft does.
  Flow.prototype.setupPaths = function (V, lines, opts) {
    this.size(V, opts);
    this.grid = null;
    this.paths = lines.map(function (l) {
      var pts = l.pts[l.pts.length - 1][0] < l.pts[0][0] ? l.pts.slice().reverse() : l.pts, cum = [0];
      for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return { pts: pts, cum: cum, len: cum[cum.length - 1], accent: l.accent };
    }).filter(function (p) { return p.len > 60; });
    this.total = this.paths.reduce(function (a, p) { return a + p.len; }, 0);
    var count = Math.round(Math.min(280, this.total / 60));
    this.n = count;
    this.pi = new Uint16Array(count);
    this.s = new Float32Array(count);
    this.speed = new Float32Array(count);
    this.px = new Float32Array(count);
    this.py = new Float32Array(count);
    this.sx = new Float32Array(count);
    this.sy = new Float32Array(count);
    this.age = new Float32Array(count);
    this.life = new Float32Array(count);
    for (var p = 0; p < count; p++) this.spawnPath(p, true);
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (var k = 0; k < 30; k++) { this.step(1); this.draw(); }
  };

  // The point a distance s along a path.
  Flow.prototype.along = function (path, s, out) {
    var c = path.cum, lo = 0, hi = c.length - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (c[mid] > s) hi = mid; else lo = mid; }
    var a = path.pts[lo], b = path.pts[hi], t = (s - c[lo]) / ((c[hi] - c[lo]) || 1);
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
  };

  Flow.prototype.spawnPath = function (i, initial) {
    for (var tries = 0; tries < 10; tries++) {
      // Longer lines get more pulses; none start under the page's text.
      var r = Math.random() * this.total, k = 0;
      while (k < this.paths.length - 1 && r > this.paths[k].len) { r -= this.paths[k].len; k++; }
      this.pi[i] = k;
      this.s[i] = r;
      this.along(this.paths[k], r, this.vel);
      if (calm(this.V, this.vel[0], 0, true) > 0.3) break;
    }
    this.px[i] = this.vel[0];
    this.py[i] = this.vel[1];
    this.sx[i] = NaN;
    this.speed[i] = 0.7 + Math.random() * 0.5;
    this.life[i] = 160 + Math.random() * 240;
    this.age[i] = initial ? Math.random() * this.life[i] : 0;
  };

  Flow.prototype.step = function (dt) {
    if (this.paths) {
      for (var j = 0; j < this.n; j++) {
        var path = this.paths[this.pi[j]];
        this.s[j] += this.speed[j] * dt;
        this.age[j] += dt;
        if (this.s[j] > path.len || this.age[j] > this.life[j]) { this.spawnPath(j, false); continue; }
        this.sx[j] = this.px[j];
        this.sy[j] = this.py[j];
        this.along(path, this.s[j], this.vel);
        this.px[j] = this.vel[0];
        this.py[j] = this.vel[1];
        if (calm(this.V, this.px[j], 0, true) < 0.15) this.sx[j] = NaN; // out of sight under the text
      }
      return;
    }
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
      if (this.age[i] > this.life[i] || s < 0.02 || this.px[i] < -4 || this.py[i] < -4 || this.px[i] > this.w + 4 || this.py[i] > this.h + 4 ||
          calm(this.V, this.px[i], 0, true) < 0.15) {
        this.spawn(i, false);
      }
    }
  };

  Flow.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = this.fade;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'source-over';
    if (this.paths) {
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      [false, true].forEach(function (accent) {
        ctx.beginPath();
        for (var i = 0; i < this.n; i++) {
          if (this.paths[this.pi[i]].accent !== accent || this.sx[i] !== this.sx[i]) continue;
          ctx.moveTo(this.sx[i], this.sy[i]);
          ctx.lineTo(this.px[i], this.py[i]);
        }
        ctx.strokeStyle = accent ? 'rgba(201,160,135,0.9)' : 'rgba(231,232,228,0.5)';
        ctx.stroke();
      }, this);
      return;
    }
    ctx.lineWidth = 1;
    for (var b = 0; b < 3; b++) {
      ctx.beginPath();
      for (var i = 0; i < this.n; i++) {
        if (this.bucket[i] !== b || this.sx[i] !== this.sx[i]) continue;
        ctx.moveTo(this.sx[i], this.sy[i]);
        ctx.lineTo(this.px[i], this.py[i]);
      }
      ctx.strokeStyle = this.colors[b];
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
    var go = !reduceMotion && !this.paused && this.visible && !document.hidden && !!(this.grid || this.paths);
    if (go && !this.running) {
      this.running = true;
      this.last = 0;
      requestAnimationFrame(this.frame);
    } else if (!go) {
      this.running = false;
    }
  };

  /* ---------- Rendering ---------- */

  // The right-hand edge of the page's own text laid over a chart, in the chart's pixels.
  function textEdge(canvas) {
    var box = canvas.getBoundingClientRect(), right = 0;
    Array.prototype.forEach.call(canvas.parentNode.querySelectorAll('h1, .lede, .hero-affil, .cta-row'), function (el) {
      var r = document.createRange();
      r.selectNodeContents(el);
      var b = r.getBoundingClientRect();
      if (b.width) right = Math.max(right, b.right - box.left);
    });
    return right;
  }

  // Where the page's title and text sit over a full-bleed chart, kept quiet so they read cleanly,
  // on screens wide enough to set the text beside the chart's busiest part. The lettering also keeps
  // clear of the header and of the caption or key along the bottom. On phones the text covers the
  // inner pages' charts, so those keep their lines and drop their lettering.
  function quietArea(canvas, w, h) {
    if (!canvas.classList.contains('chart-layer')) return null;
    var hero = canvas.parentNode.classList.contains('hero');
    if (w < 640) return hero ? null : { x: -Infinity, fade: 1, top: Infinity, bottom: -Infinity };
    var edge = textEdge(canvas) || w * 0.5;
    return { x: Math.min(edge - 40, w * 0.55), fade: w * 0.12, top: hero ? 92 : 84, bottom: h - (hero ? 92 : 34) };
  }

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
    V.quiet = quietArea(canvas, w, h);
    drawBase(ctx, V, spec);
    if (spec.draw) spec.draw(ctx, V, dpr);
    drawPlaces(ctx, V, spec);
    if (spec.note) drawAnnotation(ctx, V, spec.note);
    if (spec.scale) drawScale(ctx, V, spec.view.lat, spec.view.lon);
    if (V.quiet && isFinite(V.quiet.x)) {
      // Let the chart fade out under the text column.
      var end = V.quiet.x + V.quiet.fade, g = ctx.createLinearGradient(0, 0, end, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.85)');
      g.addColorStop(V.quiet.x / end, 'rgba(0,0,0,0.6)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, end, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (this.flow && spec.wind) {
      this.flow.setup(V, spec.wind, spec.flow);
      this.flow.update();
    } else if (this.flow && spec.paths) {
      this.flow.setupPaths(V, spec.paths, spec.flow);
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
