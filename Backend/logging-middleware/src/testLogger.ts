import { Log } from './log.js';

(async () => {
  await Log('backend', 'error', 'handler', 'received string, expected bool');
  await Log('backend', 'fatal', 'db', 'Critical database connection failure.');
})();