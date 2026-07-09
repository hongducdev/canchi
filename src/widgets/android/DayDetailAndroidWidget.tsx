'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { DayDetailWidgetProps } from '../types';
import { WIDGET_PAD, WIDGET_RADIUS, widgetPalette, type WidgetScheme } from './theme';

type Props = DayDetailWidgetProps & { scheme: WidgetScheme };

export function DayDetailAndroidWidget({
  headerTitle,
  solarDay,
  weekdayName,
  yearCanChi,
  monthCanChi,
  dayCanChi,
  lunarDay,
  lunarMonthLabel,
  hoangDaoStar,
  gioHoangDaoLine,
  dateKey,
  scheme,
}: Props) {
  const c = widgetPalette(scheme);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `licham://day/${dateKey}` }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: c.bg,
        flexDirection: 'column',
        borderRadius: WIDGET_RADIUS,
        overflow: 'hidden',
      }}
    >
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: c.headerBg,
          paddingVertical: 10,
          paddingHorizontal: WIDGET_PAD,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextWidget
          text={headerTitle}
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: c.headerText,
            textAlign: 'center',
          }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          flex: 1,
          width: 'match_parent',
          flexDirection: 'column',
          paddingHorizontal: WIDGET_PAD,
          paddingTop: 8,
          paddingBottom: WIDGET_PAD,
        }}
      >
        <FlexWidget
          style={{
            width: 'match_parent',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 4,
          }}
        >
          <TextWidget
            text={String(solarDay)}
            style={{
              fontSize: 56,
              fontWeight: '200',
              color: c.text,
              textAlign: 'center',
            }}
          />
          <TextWidget
            text={weekdayName}
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: c.text,
              textAlign: 'center',
              marginTop: -4,
            }}
          />
        </FlexWidget>

        <FlexWidget
          style={{
            width: 'match_parent',
            height: 1,
            backgroundColor: c.divider,
            marginVertical: 8,
          }}
        />

        <FlexWidget
          style={{
            width: 'match_parent',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <FlexWidget
            style={{
              width: 0,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: 6,
            }}
          >
            <TextWidget
              text={yearCanChi}
              style={{ fontSize: 12, fontWeight: '600', color: c.text }}
              maxLines={1}
              truncate="END"
            />
            <TextWidget
              text={monthCanChi}
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: c.text,
                marginTop: 3,
              }}
              maxLines={1}
              truncate="END"
            />
            <TextWidget
              text={dayCanChi}
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: c.text,
                marginTop: 3,
              }}
              maxLines={1}
              truncate="END"
            />
          </FlexWidget>

          <FlexWidget
            style={{
              width: 0,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <TextWidget
              text={String(lunarDay)}
              style={{
                fontSize: 40,
                fontWeight: '200',
                color: c.accent,
              }}
            />
            <FlexWidget
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 6,
              }}
            >
              <TextWidget
                text="Âm lịch"
                style={{ fontSize: 11, fontWeight: '500', color: c.muted }}
              />
              <TextWidget
                text={lunarMonthLabel}
                style={{ fontSize: 13, fontWeight: '700', color: c.accent }}
                maxLines={1}
                truncate="END"
              />
            </FlexWidget>
          </FlexWidget>
        </FlexWidget>

        <TextWidget
          text={hoangDaoStar}
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: c.jade,
            marginTop: 2,
          }}
          maxLines={1}
          truncate="END"
        />
        <TextWidget
          text={gioHoangDaoLine}
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: c.muted,
            marginTop: 4,
          }}
          maxLines={3}
          truncate="END"
        />

        <FlexWidget style={{ flex: 1 }} />

        <FlexWidget
          style={{
            width: 'match_parent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          <FlexWidget
            style={{
              backgroundColor: c.ctaBg,
              borderColor: c.ctaBorder,
              borderWidth: 1.5,
              borderRadius: 999,
              paddingVertical: 8,
              paddingHorizontal: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextWidget
              text="Xem chi tiết"
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: c.ctaText,
                textAlign: 'center',
              }}
            />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
