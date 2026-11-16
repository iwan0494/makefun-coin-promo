import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
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

const launchPath = join(OUTPUT_DIR, 'LAUNCH.json');
let launch;
try {
  launch = JSON.parse(readFileSync(launchPath, 'utf8'));
  const base58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
  const validMint = typeof launch.mint === 'string' && launch.mint.length >= 32 && launch.mint.length <= 44 && base58.test(launch.mint);
  const validSignature = typeof launch.create_signature === 'string' && launch.create_signature.length >= 64 && launch.create_signature.length <= 88 && base58.test(launch.create_signature);
  if (!validMint || !validSignature) {
    throw new Error('mint or create_signature is missing or has an invalid base58 value or length');
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Copied LAUNCH.json failed validation: ${message}`);
  process.exit(1);
}
console.log(`LAUNCH.json copied and verified for mint ${launch.mint}`);
