// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The post itself is the entry: a GTA 6 meme posted on X. This program's only
// job is to hand the post's address to the gate, by copying POST.json from the
// repository into /output. It refuses to run when POST.json still holds the
// starter's placeholder, so a submission can never go out naming no post.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post address, as the post's Share button shows it:
// https://x.com/<handle>/status/<digits> (twitter.com reads the same,
// and so does the /i/web/status/<digits> form).
const POST_URL =
  /^https:\/\/(www\.|mobile\.)?(x|twitter)\.com\/([^/]+\/status\/\d+|i\/web\/status\/\d+)$/;

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

const source = join(BOT_DIR, 'POST.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  fail(`cannot read ${source}: ${(err as Error).message}`);
}

const url = (parsed as { url?: unknown } | null)?.url;
if (typeof url !== 'string' || !POST_URL.test(url)) {
  fail(`POST.json names no X post address (got ${JSON.stringify(url)})`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify({ url }) + '\n');
console.log(`gta6-meme-x-01: handed in ${url}`);
