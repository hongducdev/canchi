/**
 * Compass helpers: heading, 8 directions, 24 mountains (sơn).
 */

export type Cardinal8 = {
  key: string;
  label: string;
};

export type Mountain24 = {
  name: string;
  /** Center bearing in degrees (0 = North). */
  centerDeg: number;
};

/** 8 hướng, mỗi hướng 45° (Bắc = 337.5–22.5). */
export const CARDINAL_8: Cardinal8[] = [
  { key: 'N', label: 'Bắc' },
  { key: 'NE', label: 'Đông Bắc' },
  { key: 'E', label: 'Đông' },
  { key: 'SE', label: 'Đông Nam' },
  { key: 'S', label: 'Nam' },
  { key: 'SW', label: 'Tây Nam' },
  { key: 'W', label: 'Tây' },
  { key: 'NW', label: 'Tây Bắc' },
];

/**
 * 24 sơn — mỗi cung 15°, tâm từ Bắc.
 * Thứ tự: Nhâm… quanh vòng (Nhâm tâm 345°).
 */
export const MOUNTAINS_24: Mountain24[] = [
  { name: 'Nhâm', centerDeg: 345 },
  { name: 'Tý', centerDeg: 0 },
  { name: 'Quý', centerDeg: 15 },
  { name: 'Sửu', centerDeg: 30 },
  { name: 'Cấn', centerDeg: 45 },
  { name: 'Dần', centerDeg: 60 },
  { name: 'Giáp', centerDeg: 75 },
  { name: 'Mão', centerDeg: 90 },
  { name: 'Ất', centerDeg: 105 },
  { name: 'Tốn', centerDeg: 120 },
  { name: 'Thìn', centerDeg: 135 },
  { name: 'Tỵ', centerDeg: 150 },
  { name: 'Bính', centerDeg: 165 },
  { name: 'Ngọ', centerDeg: 180 },
  { name: 'Đinh', centerDeg: 195 },
  { name: 'Khôn', centerDeg: 210 },
  { name: 'Mùi', centerDeg: 225 },
  { name: 'Thân', centerDeg: 240 },
  { name: 'Canh', centerDeg: 255 },
  { name: 'Dậu', centerDeg: 270 },
  { name: 'Tân', centerDeg: 285 },
  { name: 'Càn', centerDeg: 300 },
  { name: 'Tuất', centerDeg: 315 },
  { name: 'Hợi', centerDeg: 330 },
];

export function normalizeDeg(deg: number): number {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
}

/** Heading from magnetometer x/y (device flat). 0 = North. */
export function headingFromMagnetometer(x: number, y: number): number {
  // atan2(y, x) with device axes → adjust so 0 faces North when phone top points North
  const rad = Math.atan2(y, x);
  let deg = (rad * 180) / Math.PI;
  // Convert to compass heading (0° North, clockwise)
  deg = 90 - deg;
  return normalizeDeg(deg);
}

export function cardinal8FromHeading(heading: number): Cardinal8 {
  const h = normalizeDeg(heading);
  const idx = Math.round(h / 45) % 8;
  return CARDINAL_8[idx]!;
}

export function mountain24FromHeading(heading: number): Mountain24 {
  const h = normalizeDeg(heading);
  let best = MOUNTAINS_24[0]!;
  let bestDist = 999;
  for (const m of MOUNTAINS_24) {
    let d = Math.abs(normalizeDeg(h - m.centerDeg));
    if (d > 180) d = 360 - d;
    if (d < bestDist) {
      bestDist = d;
      best = m;
    }
  }
  return best;
}

export type CompassReading = {
  heading: number;
  cardinal: Cardinal8;
  mountain: Mountain24;
};

export function readingFromMagnetometer(x: number, y: number): CompassReading {
  const heading = headingFromMagnetometer(x, y);
  return {
    heading,
    cardinal: cardinal8FromHeading(heading),
    mountain: mountain24FromHeading(heading),
  };
}
