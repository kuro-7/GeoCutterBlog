import { mkdirSync, lstatSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createImageKey } from './image-key.mjs';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const require = createRequire(import.meta.url);

function upload() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error('Usage: npm run image:upload -- <article-id> <file-path>');
  }

  const [articleId, filePath] = args;
  const stat = lstatSync(filePath);
  if (!stat.isFile()) {
    throw new Error('File must be a regular file');
  }
  if (stat.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 10 MiB or smaller');
  }

  const image = createImageKey(articleId, filePath, readFileSync(filePath));
  const configHome = process.env.XDG_CONFIG_HOME || join(tmpdir(), 'geocutter-blog-wrangler');
  mkdirSync(configHome, { recursive: true });

  const wranglerCli = require.resolve('wrangler');
  const result = spawnSync(
    process.execPath,
    [
      wranglerCli,
      'r2',
      'object',
      'put',
      `geocutter/${image.key}`,
      '--file',
      filePath,
      '--content-type',
      image.mimeType,
      '--cache-control',
      'public, max-age=31536000, immutable',
      '--remote',
    ],
    {
      env: { ...process.env, XDG_CONFIG_HOME: configHome },
      shell: false,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log(`R2 key: ${image.key}`);
  console.log(`Public URL: ${image.url}`);
  console.log(`Markdown: ![画像の説明を入力](${image.url})`);
}

try {
  upload();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
