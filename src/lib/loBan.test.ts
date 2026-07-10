import { describe, expect, it } from 'vitest';
import {
  convertLoBanUnit,
  LO_BAN_RULERS,
  measureAllLoBan,
  measureLoBan,
  suggestGoodSize,
} from './loBan';

describe('Lo Ban units', () => {
  it('converts between millimeters and centimeters', () => {
    expect(convertLoBanUnit(900, 'mm', 'cm')).toBe(90);
    expect(convertLoBanUnit(90, 'cm', 'mm')).toBe(900);
    expect(convertLoBanUnit(90, 'cm', 'cm')).toBe(90);
  });
});

describe('Lo Ban ruler data', () => {
  it('contains the correct large and small cung structures', () => {
    expect(LO_BAN_RULERS.map((ruler) => ruler.cung.length)).toEqual([8, 8, 10]);
    expect(LO_BAN_RULERS.map((ruler) => ruler.cung[0]!.smallCung.length)).toEqual([
      5, 4, 4,
    ]);
    expect(
      LO_BAN_RULERS.every((ruler) =>
        ruler.cung.every(
          (largeCung) =>
            largeCung.smallCung.length === ruler.cung[0]!.smallCung.length
        )
      )
    ).toBe(true);
  });
});

describe('measureLoBan', () => {
  it.each([
    ['duong-522', 1, 'Quý Nhân', 'Quyền Lộc'],
    ['duong-522', 7, 'Hiểm Họa', 'Án Thành'],
    ['duong-429', 1, 'Tài', 'Tài Đức'],
    ['am-388', 1, 'Đinh', 'Đỗ Đạt'],
  ] as const)(
    'maps %s at %s cm to %s / %s',
    (rulerId, sizeCm, largeName, smallName) => {
      const result = measureLoBan(rulerId, sizeCm);

      expect(result?.largeCung.name).toBe(largeName);
      expect(result?.smallCung.name).toBe(smallName);
    }
  );

  it('moves to the next cung exactly at a large-cung boundary', () => {
    expect(measureLoBan('duong-522', 6.5249)?.largeCung.name).toBe('Quý Nhân');
    expect(measureLoBan('duong-522', 6.525)?.largeCung.name).toBe('Hiểm Họa');
  });

  it('starts the first cung again at an exact cycle rollover', () => {
    const result = measureLoBan('duong-522', 52.2);

    expect(result?.offsetCm).toBe(0);
    expect(result?.largeCung.name).toBe('Quý Nhân');
    expect(result?.smallCung.name).toBe('Quyền Lộc');
  });

  it('selects the correct cung on every large and small boundary', () => {
    for (const ruler of LO_BAN_RULERS) {
      const largeWidth = ruler.cycleCm / ruler.cung.length;
      const smallPerLarge = ruler.cung[0]!.smallCung.length;
      const smallWidth = ruler.cycleCm / (ruler.cung.length * smallPerLarge);

      for (let index = 1; index < ruler.cung.length; index++) {
        const boundary = index * largeWidth;
        expect(measureLoBan(ruler.id, boundary - 0.000001)?.largeCungIndex).toBe(
          index - 1
        );
        expect(measureLoBan(ruler.id, boundary)?.largeCungIndex).toBe(index);
        expect(measureLoBan(ruler.id, boundary + 0.000001)?.largeCungIndex).toBe(
          index
        );
      }

      for (let index = 1; index < ruler.cung.length * smallPerLarge; index++) {
        const boundary = index * smallWidth;
        const previous = measureLoBan(ruler.id, boundary - 0.000001);
        const current = measureLoBan(ruler.id, boundary);
        const after = measureLoBan(ruler.id, boundary + 0.000001);
        expect(
          previous!.largeCungIndex * smallPerLarge + previous!.smallCungIndex
        ).toBe(index - 1);
        expect(
          current!.largeCungIndex * smallPerLarge + current!.smallCungIndex
        ).toBe(index);
        expect(after!.largeCungIndex * smallPerLarge + after!.smallCungIndex).toBe(
          index
        );
      }
    }
  });

  it('maps the center of every large cung and every cycle rollover', () => {
    for (const ruler of LO_BAN_RULERS) {
      const largeWidth = ruler.cycleCm / ruler.cung.length;
      ruler.cung.forEach((largeCung, index) => {
        const center = index * largeWidth + largeWidth / 2;
        expect(measureLoBan(ruler.id, center)?.largeCung.name).toBe(largeCung.name);
      });
      expect(measureLoBan(ruler.id, ruler.cycleCm)?.largeCungIndex).toBe(0);
      expect(measureLoBan(ruler.id, ruler.cycleCm * 2)?.smallCungIndex).toBe(0);
    }
  });

  it('evaluates values above the visual ruler range', () => {
    for (const ruler of LO_BAN_RULERS) {
      const result = measureLoBan(ruler.id, 2500);
      expect(result?.sizeCm).toBe(2500);
      expect(result?.offsetCm).toBeGreaterThanOrEqual(0);
      expect(result?.offsetCm).toBeLessThan(ruler.cycleCm);
    }
  });

  it('rejects invalid measurements', () => {
    expect(measureLoBan('duong-522', 0)).toBeNull();
    expect(measureLoBan('duong-522', -1)).toBeNull();
    expect(measureLoBan('duong-522', Number.NaN)).toBeNull();
    expect(measureLoBan('duong-522', Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('multi-ruler lookup and suggestions', () => {
  it('returns a result for all three rulers', () => {
    expect(measureAllLoBan(90)).toHaveLength(3);
  });

  it('suggests a measurement in a good large cung for every ruler', () => {
    const expected = [22.84, 18.77, 9.7];
    LO_BAN_RULERS.forEach((ruler, index) => {
      const suggestion = suggestGoodSize(ruler.id, 7);
      expect(suggestion).toBe(expected[index]);
      expect(measureLoBan(ruler.id, suggestion!)?.largeCung.good).toBe(true);
    });
  });
});
