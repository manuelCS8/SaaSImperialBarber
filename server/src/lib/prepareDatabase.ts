import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPrismaDbPush(): Promise<void> {
  const serverRoot = path.resolve(__dirname, '..', '..');
  await execFileAsync('npx', ['prisma', 'db', 'push', '--skip-generate'], {
    cwd: serverRoot,
    env: process.env,
  });
}

export async function prepareDatabaseInBackground() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  void (async () => {
    const maxAttempts = 15;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await runPrismaDbPush();
        console.log('✅ Prisma schema sincronizado con PostgreSQL');
        return;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(
          `⚠️ Postgres no disponible (intento ${attempt}/${maxAttempts}): ${detail.slice(0, 120)}`
        );

        if (attempt === maxAttempts) {
          console.error(
            '❌ No se pudo conectar a Postgres. En Render: abre la BD imperial-barber-db y espera Available, luego reinicia el servicio.'
          );
          return;
        }

        await sleep(20_000);
      }
    }
  })();
}
