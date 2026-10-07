// Traces the contour lines behind the hero and writes
// public/montpelier-contours.svg. The elevation comes from the USGS 3DEP
// service, which is in the public domain. The SVG is committed, so builds never
// touch the network; run `npm run contours` only to change the map.

import { writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { contours } from 'd3-contour';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(root, 'public/montpelier-contours.svg');
const SERVICE =
  'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage';

// Downtown Montpelier, where the Winooski and North Branch valleys meet.
const CENTER = { lat: 44.2601, lon: -72.5754 };
const WIDTH_KM = 32;
const HEIGHT_KM = 20;
const COLUMNS = 480; // about 67 m per cell
const ROWS = 300;
const INTERVAL_M = 40;
const INDEX_EVERY = 5; // a heavier line every 200 m
const BLUR_PASSES = 2; // smooths survey noise so the lines read as terrain
const TOLERANCE = 0.4; // simplification tolerance, in cells
const MIN_LENGTH = 8; // drops fragments shorter than this, in cells

// Web Mercator keeps shapes true at this latitude, as long as ground distances
// are stretched by its scale factor.
function boundingBox() {
  const earthRadius = 6378137;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const x = earthRadius * toRadians(CENTER.lon);
  const y =
    earthRadius * Math.log(Math.tan(Math.PI / 4 + toRadians(CENTER.lat) / 2));
  const scale = 1 / Math.cos(toRadians(CENTER.lat));
  const halfWidth = (WIDTH_KM * 1000 * scale) / 2;
  const halfHeight = (HEIGHT_KM * 1000 * scale) / 2;
  return [x - halfWidth, y - halfHeight, x + halfWidth, y + halfHeight];
}

async function fetchElevation() {
  const params = new URLSearchParams({
    bbox: boundingBox()
      .map((n) => n.toFixed(0))
      .join(','),
    bboxSR: '3857',
    imageSR: '3857',
    size: `${COLUMNS},${ROWS}`,
    format: 'bsq',
    pixelType: 'F32',
    interpolation: 'RSP_BilinearInterpolation',
    f: 'image',
  });
  // The service times out under load now and then, so retry server errors.
  let response;
  for (let attempt = 1; attempt <= 4; attempt++) {
    response = await fetch(`${SERVICE}?${params}`);
    if (response.status < 500 || attempt === 4) break;
    console.log(`USGS answered ${response.status}, retrying`);
    await sleep(5000 * attempt);
  }
  if (!response.ok) {
    throw new Error(`USGS answered ${response.status} ${response.statusText}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());

  // Band-sequential 32-bit floats, little endian, north row first. A one-bit
  // no-data mask follows the values.
  const count = COLUMNS * ROWS;
  if (bytes.length < count * 4) {
    throw new Error(
      `expected ${count * 4} bytes of elevation, got ${bytes.length}`,
    );
  }
  const values = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    values[i] = bytes.readFloatLE(i * 4);
    if (!(values[i] > -100 && values[i] < 2000)) {
      throw new Error(`implausible elevation ${values[i]} m in cell ${i}`);
    }
  }
  return values;
}

function blur(values) {
  const out = new Float64Array(values.length);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= COLUMNS || yy >= ROWS) continue;
          sum += values[yy * COLUMNS + xx];
          n++;
        }
      }
      out[y * COLUMNS + x] = sum / n;
    }
  }
  return out;
}

// d3-contour closes every ring along the edge of the grid. Splitting rings
// where they reach the edge keeps those border segments out of the map.
function splitAtEdges(ring) {
  const margin = 0.6;
  const inside = ([x, y]) =>
    x > margin && x < COLUMNS - margin && y > margin && y < ROWS - margin;
  const runs = [];
  let run = [];
  for (const point of ring) {
    if (inside(point)) {
      run.push(point);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);
  return runs;
}

function length(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      points[i][0] - points[i - 1][0],
      points[i][1] - points[i - 1][1],
    );
  }
  return total;
}

// Douglas-Peucker: keeps the points that bend the line by more than the
// tolerance.
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const span = Math.hypot(dx, dy) || 1e-9;
    let farthest = -1;
    let distance = -1;
    for (let i = a + 1; i < b; i++) {
      const d =
        Math.abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) /
        span;
      if (d > distance) {
        distance = d;
        farthest = i;
      }
    }
    if (distance > tolerance) {
      keep[farthest] = 1;
      stack.push([a, farthest], [farthest, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

// Relative moves at one decimal, without leading zeros, keep the file small.
function toPath(points, closed) {
  const round = (n) => Math.round(n * 10) / 10;
  let [px, py] = points[0].map(round);
  let d = `M${px} ${py}`;
  for (const point of points.slice(1)) {
    const [x, y] = point.map(round);
    const dx = round(x - px);
    const dy = round(y - py);
    if (dx === 0 && dy === 0) continue;
    d += `l${dx}${dy < 0 ? '' : ' '}${dy}`;
    px = x;
    py = y;
  }
  if (closed) d += 'z';
  return d.replace(/(^|[^\d])0\./g, '$1.');
}

let values = await fetchElevation();
for (let pass = 0; pass < BLUR_PASSES; pass++) values = blur(values);

let min = Infinity;
let max = -Infinity;
for (const value of values) {
  min = Math.min(min, value);
  max = Math.max(max, value);
}

const tracer = contours().size([COLUMNS, ROWS]);
const lines = { regular: [], index: [] };
let levels = 0;
for (
  let level = Math.ceil(min / INTERVAL_M) * INTERVAL_M;
  level <= max;
  level += INTERVAL_M
) {
  levels++;
  const kind = (level / INTERVAL_M) % INDEX_EVERY === 0 ? 'index' : 'regular';
  for (const polygon of tracer.contour(values, level).coordinates) {
    for (const ring of polygon) {
      const runs = splitAtEdges(ring);
      const closed = runs.length === 1 && runs[0].length === ring.length;
      for (const run of runs) {
        if (length(run) < MIN_LENGTH) continue;
        const points = simplify(run, TOLERANCE);
        if (points.length >= 2) lines[kind].push(toPath(points, closed));
      }
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLUMNS} ${ROWS}">
<!-- Contour lines every ${INTERVAL_M} m, with index lines every ${INTERVAL_M * INDEX_EVERY} m, for the hills around Montpelier, Vermont. Traced by scripts/contours.mjs from USGS 3DEP elevation data, which is in the public domain. -->
<path d="${lines.regular.join('')}" fill="none" stroke="#000" stroke-opacity=".5" vector-effect="non-scaling-stroke"/>
<path d="${lines.index.join('')}" fill="none" stroke="#000" vector-effect="non-scaling-stroke"/>
</svg>
`;
await writeFile(OUTPUT, svg);

console.log(
  `wrote ${relative(root, OUTPUT)}: ${levels} levels from ${Math.round(min)} to ${Math.round(max)} m, ${(svg.length / 1024).toFixed(1)} KB`,
);
