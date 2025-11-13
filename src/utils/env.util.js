import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import * as envfile from 'envfile';

const ENV_FILE = '.env';

export const getEnvFileContent = async (wd) => {
  const envPath = path.join(wd, ENV_FILE);
  try {
    return await fsp.readFile(envPath, 'utf8');
  } catch (err) {
    if (err?.code === 'ENOENT') return null; // sem .env ainda
    throw err; // outros erros não devem ser silenciados
  }
};

export const getEnvDataSync = (envPath) => {
  // garante arquivo e pasta
  const dir = path.dirname(envPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(envPath)) {
    fs.closeSync(fs.openSync(envPath, 'w', 0o600));
    return {};
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  try {
    return envfile.parse(raw);
  } catch {
    // se estiver corrompido, não quebra a execução
    return {};
  }
};

export const setEnvDataSync = (wd, envData) => {
  const envPath = path.join(wd, ENV_FILE);

  const current = getEnvDataSync(envPath);
  const finalData = Object.fromEntries(
    Object.entries({ ...current, ...envData })
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  const out = envfile.stringify(finalData);

  // escrita atômica + permissão restrita
  const tmp = `${envPath}.tmp`;
  fs.writeFileSync(tmp, out, { mode: 0o600 });
  fs.renameSync(tmp, envPath);

  return true;
};