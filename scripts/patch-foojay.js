// Persist foojay 1.0.0 patch required for Gradle 9 (IBM_SEMERU removed).
// Applied after npm install so release builds keep working.

const path = require('node:path');
const fs = require('node:fs');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native',
  'gradle-plugin',
  'settings.gradle.kts'
);

if (!fs.existsSync(target)) {
  console.warn('[patch-foojay] skip — gradle-plugin not installed');
  process.exit(0);
}

const src = fs.readFileSync(target, 'utf8');
const next = src.replace(
  /id\("org\.gradle\.toolchains\.foojay-resolver-convention"\)\.version\("0\.5\.0"\)/,
  'id("org.gradle.toolchains.foojay-resolver-convention").version("1.0.0")'
);

if (src === next) {
  if (src.includes('version("1.0.0")')) {
    console.log('[patch-foojay] already at 1.0.0');
  } else {
    console.warn('[patch-foojay] pattern not found — check RN gradle-plugin');
  }
  process.exit(0);
}

fs.writeFileSync(target, next);
console.log('[patch-foojay] bumped foojay-resolver-convention to 1.0.0');
