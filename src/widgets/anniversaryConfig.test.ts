import { describe, expect, it } from 'vitest';
import {
  buildAnniversaryWidgetProps,
  type AnniversaryWidgetConfig,
} from './anniversaryConfig';

const base: AnniversaryWidgetConfig = {
  widgetId: 12,
  title: 'Ngày quen nhau',
  startDateKey: '2021-08-10',
  displayMode: 'days',
};

describe('buildAnniversaryWidgetProps', () => {
  it('builds total-day mode', () => {
    const props = buildAnniversaryWidgetProps(base, new Date(2026, 6, 14, 12));
    expect(props.primaryValue).toBe('1,799');
    expect(props.primaryUnit).toBe('NGÀY');
    expect(props.secondaryValue).toBe('257 tuần');
  });

  it('builds years-months-days mode', () => {
    const props = buildAnniversaryWidgetProps(
      { ...base, displayMode: 'ymd' },
      new Date(2026, 6, 14, 12),
    );
    expect(props.primaryValue).toBe('4');
    expect(props.primaryUnit).toBe('NĂM');
    expect(props.secondaryValue).toBe('11 tháng 4 ngày');
    expect(props.ymdValue).toBe('4 năm 11 tháng 4 ngày');
  });
});
