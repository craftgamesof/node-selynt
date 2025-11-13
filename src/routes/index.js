import rateLimit from 'express-rate-limit';
import { Router } from 'express';
import AnsiConverter from 'ansi-to-html';

import { listApps, describeApp, reloadApp, restartApp, stopApp } from '../providers/pm2/api.js';
import { validateAdminUser } from '../services/admin.service.js';
import { readLogsReverse } from '../utils/read-logs.util.js';
import { getCurrentGitBranch, getCurrentGitCommit } from '../utils/git.util.js';
import { getEnvFileContent } from '../utils/env.util.js';
import { isAuthenticated, checkAuthentication } from '../middlewares/auth.js';

const router = Router();
const ansiConvert = new AnsiConverter();

// Rate limit para /login (2 min, 100 req)
const loginRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/', (req, res) => res.redirect('/login'));

router.get('/login', loginRateLimiter, checkAuthentication, async (req, res) => {
  await res.render('auth/login', { layout: false, login: { username: '', password: '', error: null } });
});

router.post('/login', loginRateLimiter, checkAuthentication, async (req, res) => {
  const { username, password } = req.body || {};
  try {
    await validateAdminUser(String(username || '').trim(), String(password || '').trim());
    req.session.isAuthenticated = true;
    return res.redirect('/apps');
  } catch (err) {
    return res.status(401).render('auth/login', {
      layout: false,
      login: { username, password: '', error: err?.message || 'Invalid credentials' }
    });
  }
});

router.get('/apps', isAuthenticated, async (req, res) => {
    const apps = await listApps();
    const appsView = apps.map(a => ({
    ...a,
    badgeClass: a.status === 'online' ? 'bg-green-lt' : 'bg-red-lt',
    isOnline: a.status === 'online'
  }));

  await res.render('apps/dashboard', { apps: appsView });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

router.get('/apps/:appName', isAuthenticated, async (req, res) => {
  const { appName } = req.params;
  const app = await describeApp(appName);
  if (!app) return res.redirect('/apps');

  app.badgeClass = app.status === 'online' ? 'bg-green-lt' : 'bg-red-lt';
  app.isOnline   = app.status === 'online';

  app.git_branch = await getCurrentGitBranch(app.pm2_env_cwd);
  app.git_commit = await getCurrentGitCommit(app.pm2_env_cwd);
  app.env_file   = await getEnvFileContent(app.pm2_env_cwd);

  const stdout = await readLogsReverse({ filePath: app.pm_out_log_path });
  const stderr = await readLogsReverse({ filePath: app.pm_err_log_path });

  stdout.lines = stdout.lines.map(l => ansiConvert.toHtml(l)).join('<br/>');
  stderr.lines = stderr.lines.map(l => ansiConvert.toHtml(l)).join('<br/>');

  await res.render('apps/app', { app, logs: { stdout, stderr } });
});

router.get('/api/apps/:appName/logs/:logType', isAuthenticated, async (req, res) => {
  const { appName, logType } = req.params;
  const { linePerRequest, nextKey } = req.query;

  if (logType !== 'stdout' && logType !== 'stderr') {
    return res.status(400).json({ error: 'Log Type must be stdout or stderr' });
  }

  const app = await describeApp(appName);
  const filePath = logType === 'stdout' ? app.pm_out_log_path : app.pm_err_log_path;

  let logs = await readLogsReverse({ filePath, nextKey, linePerRequest });
  logs.lines = logs.lines.map((log) => ansiConvert.toHtml(log)).join('<br/>');

  return res.json({ logs });
});

router.post('/api/apps/:appName/reload', isAuthenticated, async (req, res) => {
  try {
    const { appName } = req.params;
    const apps = await reloadApp(appName);
    return res.json({ success: Array.isArray(apps) && apps.length > 0 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post('/api/apps/:appName/restart', isAuthenticated, async (req, res) => {
  try {
    const { appName } = req.params;
    const apps = await restartApp(appName);
    return res.json({ success: Array.isArray(apps) && apps.length > 0 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post('/api/apps/:appName/stop', isAuthenticated, async (req, res) => {
  try {
    const { appName } = req.params;
    const apps = await stopApp(appName);
    return res.json({ success: Array.isArray(apps) && apps.length > 0 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;