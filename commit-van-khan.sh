#!/bin/bash
set -e

echo "Staging van-khấn feature files..."
git add \
  LICENSE \
  app/profile.tsx \
  app/van-khan.tsx \
  app/van-khan/ \
  docs/releases/ \
  docs/superpowers/ \
  docs/vi.md \
  scripts/patch-foojay.js \
  src/data/vanKhan.ts \
  src/data/vankhan.json \
  src/lib/dayPersonScore.ts \
  src/lib/vanKhan.ts \
  src/store/userProfile.ts \
  README.md \
  "app/(tabs)/settings.tsx" \
  "app/_layout.tsx" \
  "app/day/[date].tsx" \
  package.json \
  tsconfig.json \
  android/app/src/main/res/drawable/daydetail_preview.png

echo "Current git status:"
git status --short

echo ""
echo "Committing with Claude as co-author..."
git commit -m "feat: add van-khấn (prayer templates) and user profile system

Add comprehensive prayer (văn khấn) system with user profile management:

Features:
- Prayer catalog with 6 categories (định kỳ, tài lộc, Tết, lễ tiết, sự kiện, khác)
- Search and filter by name/occasion/category
- Day-based ranking: suggests best prayers for today
- User profile editor: name, birth date (solar/lunar), gender, hour chi, hometown
- Dynamic template filling: auto-populate prayers with personal info
- Day-person compatibility scoring: birth year zodiac vs. day zodiac
- Family roster integration: fill prayers for different family members
- Persistent storage via Zustand + AsyncStorage

New screens:
- /profile — User profile editor (native modal on iOS)
- /van-khan — Prayer catalog with search, filtering, today's top suggestions
- /van-khan/[id] — Prayer detail with auto-filled personal information

Related utilities:
- vanKhan.ts — Template filling, search, occasion ranking
- dayPersonScore.ts — Birth year ↔ day compatibility (cultural reference)
- userProfile.ts — Persistent profile storage with hydration

Documentation:
- docs/vi.md — Vietnamese user guide (132 lines)
- Design specs and implementation plans
- Release notes for v1.0.0+

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "Pushing to GitHub..."
git push origin main

echo "✅ Done! Claude is now listed as co-author on GitHub."
