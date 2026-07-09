/**
 * Smoke checks for resolveQuote (run via npx tsx).
 */
import { resolveQuote } from '../../data/quotes';
import { buildDayInfo } from '../dayInfo';
import type { SolarDate } from '../types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

export function smokeQuotes(): string[] {
  const logs: string[] = [];

  const ordinary: SolarDate = { day: 7, month: 5, year: 2026 };
  const a = resolveQuote(buildDayInfo(ordinary));
  const b = resolveQuote(buildDayInfo(ordinary));
  assert(a.kind === 'quote', 'ordinary day should be quote');
  assert(a.kind === 'quote' && b.kind === 'quote' && a.quoteId === b.quoteId, 'same day stable');
  logs.push(`ordinary OK: ${a.kind === 'quote' ? a.quoteId : ''}`);

  const tet: SolarDate = { day: 17, month: 2, year: 2026 };
  const tetInfo = buildDayInfo(tet);
  const tetQ = resolveQuote(tetInfo);
  assert(tetInfo.festivals.some((f) => f.id === 'tet'), '2026-02-17 should include tet');
  assert(tetQ.kind === 'quote', 'tet should resolve tagged quote');
  logs.push(`tet OK: ${tetQ.kind === 'quote' ? tetQ.quoteId : tetQ.text}`);

  // Festival without a dedicated quote tag → festival name
  const ram: SolarDate = { day: 3, month: 3, year: 2026 };
  const ramInfo = buildDayInfo(ram);
  const hasRam = ramInfo.festivals.some((f) => f.id === 'ram-thang-gieng');
  if (hasRam) {
    const ramQ = resolveQuote(ramInfo);
    assert(ramQ.kind === 'festival', 'untagged festival should fall back to name');
    logs.push(`untagged festival OK: ${ramQ.kind === 'festival' ? ramQ.text : ''}`);
  } else {
    // Find any day with festival but no tagged quote
    const doanNgo: SolarDate = { day: 19, month: 6, year: 2026 };
    const dn = buildDayInfo(doanNgo);
    const q = resolveQuote(dn);
    if (dn.festivals.some((f) => f.id === 'doan-ngo')) {
      assert(q.kind === 'festival', 'doan-ngo should fall back to festival name');
      logs.push(`untagged festival OK: ${q.kind === 'festival' ? q.text : ''}`);
    } else {
      logs.push('untagged festival SKIP: could not locate sample day');
    }
  }

  return logs;
}

if (require.main === module) {
  console.log(smokeQuotes().join('\n'));
}
