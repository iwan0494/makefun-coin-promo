import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'LAUNCH.json'), join(OUTPUT_DIR, 'LAUNCH.json'));
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`LAUNCH.json could not be copied from ${BOT_DIR}: ${message}`);
  process.exit(1);
}
