/**
 * 24 Tiết khí (solar terms) approximation for Vietnam.
 * Uses solar longitude quarters; names in Vietnamese.
 */

import { getJulianDay } from './lunar';

const TIET_KHI = [
  'Xuân phân',
  'Thanh minh',
  'Cốc vũ',
  'Lập hạ',
  'Tiểu mãn',
  'Mang chủng',
  'Hạ chí',
  'Tiểu thử',
  'Đại thử',
  'Lập thu',
  'Xử thử',
  'Bạch lộ',
  'Thu phân',
  'Hàn lộ',
  'Sương giáng',
  'Lập đông',
  'Tiểu tuyết',
  'Đại tuyết',
  'Đông chí',
  'Tiểu hàn',
  'Đại hàn',
  'Lập xuân',
  'Vũ thủy',
  'Kinh trập',
] as const;

/**
 * Approximate sun longitude in degrees for JD at Vietnam noon.
 * Simplified vs full VSOP87 but adequate for term labels.
 */
function approxSunLongitudeDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  let trueLong = L0 + C;
  trueLong = ((trueLong % 360) + 360) % 360;
  return trueLong;
}

/** Index 0..23 of current solar term at solar date. */
export function tietKhiIndex(day: number, month: number, year: number): number {
  const jd = getJulianDay(day, month, year);
  const lon = approxSunLongitudeDeg(jd);
  // Spring equinox ~0°, each term spans 15°
  // Map: 0° = Xuân phân (index 0)
  return Math.floor(lon / 15) % 24;
}

export function getTietKhi(day: number, month: number, year: number): string {
  return TIET_KHI[tietKhiIndex(day, month, year)];
}

export { TIET_KHI };
