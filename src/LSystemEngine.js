export const PRESETS = {
  fractalTree: {
    name: "Fractal Tree",
    axiom: "F",
    rules: { F: "FF+[+F-F-F]-[-F+F+F]" },
    angle: 25,
    iterations: 4,
    description: "Classic symmetric fractal tree",
  },
  kochSnowflake: {
    name: "Koch Snowflake",
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    angle: 60,
    iterations: 4,
    description: "Type-2 Koch curve — snowflake variant",
  },
  barnsleyFern: {
    name: "Barnsley Fern",
    axiom: "X",
    rules: {
      X: "F+[[X]-X]-F[-FX]+X",
      F: "FF",
    },
    angle: 25,
    iterations: 5,
    description: "Barnsley fern — biologically accurate leaf structure",
  },
};

export function applyRules(axiom, rules, iterations) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of current) {
      next += rules[char] ?? char;
    }
    current = next;
    if (current.length > 500_000) break;
  }
  return current;
}

export function computeBounds(lstring, angle, stepLen) {
  let x = 0, y = 0, theta = -90;
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  const stack = [];
  const rad = (deg) => (deg * Math.PI) / 180;
  for (const ch of lstring) {
    if (ch === "F") {
      x += stepLen * Math.cos(rad(theta));
      y += stepLen * Math.sin(rad(theta));
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else if (ch === "+") { theta += angle; }
    else if (ch === "-") { theta -= angle; }
    else if (ch === "[") { stack.push({ x, y, theta }); }
    else if (ch === "]") { if (stack.length > 0) ({ x, y, theta } = stack.pop()); }
  }
  return { minX, maxX, minY, maxY };
}

export function drawLSystem(ctx, lstring, angle, canvasWidth, canvasHeight) {
  const stepLen = 8;
  const bounds = computeBounds(lstring, angle, stepLen);
  const bw = bounds.maxX - bounds.minX;
  const bh = bounds.maxY - bounds.minY;
  const padding = 40;
  const scaleX = (canvasWidth - padding * 2) / (bw || 1);
  const scaleY = (canvasHeight - padding * 2) / (bh || 1);
  const scale = Math.min(scaleX, scaleY, 3);
  const startX = canvasWidth / 2 - ((bounds.minX + bw / 2) * scale);
  const startY = canvasHeight / 2 - ((bounds.minY + bh / 2) * scale);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  let x = startX, y = startY, theta = -90;
  const stack = [];
  const rad = (deg) => (deg * Math.PI) / 180;
  for (const ch of lstring) {
    if (ch === "F") {
      const nx = x + stepLen * scale * Math.cos(rad(theta));
      const ny = y + stepLen * scale * Math.sin(rad(theta));
      const alpha = Math.max(0.15, 0.9 - stack.length * 0.12);
      const lw = Math.max(0.4, 2 - stack.length * 0.25);
      ctx.strokeStyle = `rgba(134,239,172,${alpha})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      x = nx; y = ny;
    } else if (ch === "+") { theta += angle; }
    else if (ch === "-") { theta -= angle; }
    else if (ch === "[") { stack.push({ x, y, theta }); }
    else if (ch === "]") { if (stack.length > 0) ({ x, y, theta } = stack.pop()); }
  }
}
