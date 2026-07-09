/**
 * Lightweight smoke checks for lunar conversion (run via ts-node or import in console).
 * Verifies well-known Tết dates.
 */
import { lunarToSolar, solarToLunar } from '../lunar';

export function smokeLunar(): string[] {
  const logs: string[] = [];

  // Tết 2024 (Giáp Thìn) is Feb 10, 2024
  const tet2024 = solarToLunar(10, 2, 2024);
  logs.push(
    `Tết 2024 solar 10/2/2024 -> lunar ${tet2024.day}/${tet2024.month}/${tet2024.year} leap=${tet2024.leap}`
  );

  // Reverse: lunar 1/1/2024
  const solar = lunarToSolar(1, 1, 2024, false);
  logs.push(`Lunar 1/1/2024 -> solar ${solar.day}/${solar.month}/${solar.year}`);

  // Tết 2025 (Ất Tỵ) is Jan 29, 2025
  const tet2025 = solarToLunar(29, 1, 2025);
  logs.push(
    `Tết 2025 solar 29/1/2025 -> lunar ${tet2025.day}/${tet2025.month}/${tet2025.year}`
  );

  return logs;
}
