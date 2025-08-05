import axios from 'axios';

const LOGGING_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

const validStacks = ['backend', 'frontend'] as const;
const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

const validPackages = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  common: ['auth', 'config', 'middleware', 'utils'],
} as const;

type Stack = typeof validStacks[number];
type Level = typeof validLevels[number];
type Package =
  | typeof validPackages.backend[number]
  | typeof validPackages.frontend[number]
  | typeof validPackages.common[number];

interface LogPayload {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2c3Zpc3dhbmFkaDIwMDVAZ21haWwuY29tIiwiZXhwIjoxNzU0Mzc3MzQ2LCJpYXQiOjE3NTQzNzY0NDYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2MjIxMGJlYi1jYTFmLTRiYmQtYWIyNC0yYzE4OGJkNGE4NDgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ2YW5hcGFsbGkgc2FpIHZpc3dhbmFkaCIsInN1YiI6ImVkNTI5YTBjLWZmNTYtNDI0OC05NmIwLWNhZWE0ODc2NzZhYiJ9LCJlbWFpbCI6InZzdmlzd2FuYWRoMjAwNUBnbWFpbC5jb20iLCJuYW1lIjoidmFuYXBhbGxpIHNhaSB2aXN3YW5hZGgiLCJyb2xsTm8iOiIyMjQ4MWExMmg3IiwiYWNjZXNzQ29kZSI6IkhiRHBwRyIsImNsaWVudElEIjoiZWQ1MjlhMGMtZmY1Ni00MjQ4LTk2YjAtY2FlYTQ4NzY3NmFiIiwiY2xpZW50U2VjcmV0IjoiWWhDVlZoemdkbWp2Y1poSiJ9.GZYWiHqmdj4g3-P8M2oaLCp_z1Ajwy5B6wCe5Z5muHE";
export async function Log(stack: Stack, level: Level, pkg: Package, message: string) {
  if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);

  const isBackend = stack === 'backend';
  const isFrontend = stack === 'frontend';

  const allowedPackages = [
    ...validPackages.common,
    ...(isBackend ? validPackages.backend : []),
    ...(isFrontend ? validPackages.frontend : [])
  ];

  if (!allowedPackages.includes(pkg)) throw new Error(`Invalid package '${pkg}' for stack '${stack}'`);

  const payload: LogPayload = { stack, level, package: pkg, message };

  try {
    const response = await axios.post(LOGGING_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Log Created:', response.data);
  } catch (err: any) {
    console.error('❌ Log Failed:', err.response?.data || err.message);
  }
}