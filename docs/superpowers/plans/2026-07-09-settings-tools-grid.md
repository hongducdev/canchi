# Settings Tools Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Settings **CÔNG CỤ** list with a 2-column grid of `ToolTile` cards (icon + title + short description).

**Architecture:** Add a reusable `ToolTile` pressable card that wraps existing `Card` chrome and Ionicons. In `settings.tsx`, swap the Tools `SettingRow` stack for a `flexWrap` row of seven tiles; leave all other Settings groups unchanged.

**Tech Stack:** Expo Router, React Native, `@expo/vector-icons` (Ionicons), existing `Card` / theme tokens (`colors`, `space`, `radius`, `font`).

**Spec:** `docs/superpowers/specs/2026-07-09-settings-tools-grid-design.md`

**Verification note:** This repo has no Jest/RTL suite. Use `npm run typecheck` after code tasks and manual Settings UI checks listed in each task.

---

## File map

| File | Responsibility |
|------|----------------|
| Create `src/components/ToolTile.tsx` | Pressable tile: icon chip, title, subtitle |
| Modify `app/(tabs)/settings.tsx` | Tools section → 2-column wrap grid of `ToolTile`s |

---

### Task 1: Create `ToolTile` component

**Files:**
- Create: `src/components/ToolTile.tsx`
- Verify: `npm run typecheck`

- [ ] **Step 1: Add `ToolTile.tsx`**

Create `src/components/ToolTile.tsx` with this exact content:

```tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { font, radius, space } from '../theme/spacing';
import { Card } from './Card';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function ToolTile({ title, subtitle, icon, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Card style={styles.card}>
        <View
          style={[styles.iconChip, { backgroundColor: colors.accentSoft }]}
        >
          <Ionicons name={icon} size={20} color={colors.accentText} />
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '48%',
    minHeight: 112,
  },
  card: {
    flex: 1,
    padding: space.md,
    gap: space.sm,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: font.sm,
    lineHeight: 18,
  },
});
```

- [ ] **Step 2: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: exit 0 (no errors related to `ToolTile`).

- [ ] **Step 3: Commit**

```bash
git add src/components/ToolTile.tsx
git commit -m "$(cat <<'EOF'
feat: add ToolTile for settings tools grid

EOF
)"
```

On Windows PowerShell if heredoc fails, use:

```powershell
git add src/components/ToolTile.tsx
git commit -m "feat: add ToolTile for settings tools grid"
```

---

### Task 2: Wire Tools section to 2-column grid

**Files:**
- Modify: `app/(tabs)/settings.tsx`
- Verify: `npm run typecheck` + manual Settings check

- [ ] **Step 1: Import `ToolTile`**

At the top of `app/(tabs)/settings.tsx`, add the import next to the other component imports:

```tsx
import { ToolTile } from '../../src/components/ToolTile';
```

Keep existing imports (`Card`, `Screen`, `SettingRow`, etc.). Do not remove `SettingRow` — still used by other sections.

- [ ] **Step 2: Replace the CÔNG CỤ block**

Find this block (section label through the Tools `Card`):

```tsx
      <Text style={[styles.group, { color: colors.textMuted }]}>CÔNG CỤ</Text>
      <Card padded={false} style={styles.card}>
        <View style={styles.pad}>
          <SettingRow
            title="Tìm kiếm"
            subtitle="Ngày, lễ hội, tiết khí"
            onPress={() => router.push('/search')}
          />
          <SettingRow
            title="Ngày tốt"
            subtitle="Cưới hỏi, khai trương, xuất hành…"
            onPress={() => router.push('/lucky')}
          />
          <SettingRow
            title="Sự kiện cá nhân"
            subtitle={`${personalEvents.length} sự kiện trên máy`}
            onPress={() => router.push('/personal')}
          />
          <SettingRow
            title="Phong thủy"
            subtitle="Mệnh, màu, số, hướng theo năm sinh"
            onPress={() => router.push('/fengshui')}
          />
          <SettingRow
            title="Tính ngày lễ"
            subtitle="Đầy tháng, 49 ngày, giỗ…"
            onPress={() => router.push('/memorial')}
          />
          <SettingRow
            title="Gia đình"
            subtitle={`${familyMembers.length} thành viên trên máy`}
            onPress={() => router.push('/family')}
          />
          <SettingRow
            title="Thiên văn"
            subtitle="Trăng, nhật thực, mưa sao băng"
            onPress={() => router.push('/astronomy')}
            isLast
          />
        </View>
      </Card>
```

Replace it with:

```tsx
      <Text style={[styles.group, { color: colors.textMuted }]}>CÔNG CỤ</Text>
      <View style={styles.toolsGrid}>
        <ToolTile
          title="Tìm kiếm"
          subtitle="Ngày, lễ hội, tiết khí"
          icon="search-outline"
          onPress={() => router.push('/search')}
        />
        <ToolTile
          title="Ngày tốt"
          subtitle="Cưới hỏi, khai trương, xuất hành…"
          icon="sparkles-outline"
          onPress={() => router.push('/lucky')}
        />
        <ToolTile
          title="Sự kiện cá nhân"
          subtitle={`${personalEvents.length} sự kiện trên máy`}
          icon="calendar-outline"
          onPress={() => router.push('/personal')}
        />
        <ToolTile
          title="Phong thủy"
          subtitle="Mệnh, màu, số, hướng theo năm sinh"
          icon="compass-outline"
          onPress={() => router.push('/fengshui')}
        />
        <ToolTile
          title="Tính ngày lễ"
          subtitle="Đầy tháng, 49 ngày, giỗ…"
          icon="flower-outline"
          onPress={() => router.push('/memorial')}
        />
        <ToolTile
          title="Gia đình"
          subtitle={`${familyMembers.length} thành viên trên máy`}
          icon="people-outline"
          onPress={() => router.push('/family')}
        />
        <ToolTile
          title="Thiên văn"
          subtitle="Trăng, nhật thực, mưa sao băng"
          icon="planet-outline"
          onPress={() => router.push('/astronomy')}
        />
      </View>
```

- [ ] **Step 3: Add `toolsGrid` style**

In the `StyleSheet.create` at the bottom of `settings.tsx`, add:

```tsx
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
```

Do not remove unused styles yet if `pad` / `card` are still used by other sections (they are).

- [ ] **Step 4: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 5: Manual UI check**

With `npm run start` / Expo Go:

1. Open **Cài đặt** tab.
2. Confirm **CÔNG CỤ** shows **2 tiles per row**, 4 rows (last row: Thiên văn alone, left-aligned).
3. Tap each tile and confirm routes: `/search`, `/lucky`, `/personal`, `/fengshui`, `/memorial`, `/family`, `/astronomy`.
4. Toggle theme (Chủ đề) and confirm icon chips stay readable in light and dark.
5. Confirm **GIAO DIỆN** / **LỊCH** / other sections still use list rows.

- [ ] **Step 6: Commit**

```bash
git add app/(tabs)/settings.tsx
git commit -m "$(cat <<'EOF'
feat: show settings tools as a two-column grid

EOF
)"
```

PowerShell fallback:

```powershell
git add "app/(tabs)/settings.tsx"
git commit -m "feat: show settings tools as a two-column grid"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| 2 columns, wrap, gap `space.sm` | Task 2 (`toolsGrid` + tile `width: '48%'`) |
| Separate tiles (Approach A), not one card | Task 2 |
| Icon chip + title + subtitle | Task 1 |
| Ionicons outline catalog | Task 2 |
| Dynamic personal/family counts | Task 2 subtitles |
| Other Settings sections unchanged | Task 2 (only CÔNG CỤ replaced) |
| Theme tokens / no new deps | Task 1 |
| Last odd tile left-aligned | Task 1 `width: '48%'` + Task 2 `space-between` |

## Plan self-review

- No TBD/placeholder steps; full component and JSX included.
- Prop names consistent: `title`, `subtitle`, `icon`, `onPress`.
- Commits are optional per user preference at execution time — skip Step 3/6 commits if the user has not asked to commit.
