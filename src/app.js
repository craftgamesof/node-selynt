#!/usr/bin/env node

import config from './config/index.js';
import { setEnvDataSync } from './utils/env.util.js';
import { generateRandomString } from './utils/random.util.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

import render from './providers/selynt-render.js';
import router from './routes/index.js';

// __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init
if (!config.APP_USERNAME || !config.APP_PASSWORD) {
  console.log('You must first setup admin user. Run command -> npm run setup-admin-user');
  process.exit(2);
}
if (!config.APP_SESSION_SECRET) {
  const randomString = generateRandomString();
  setEnvDataSync(config.APP_DIR, { APP_SESSION_SECRET: randomString });
  config.APP_SESSION_SECRET = randomString;
}

const app = express();

// Segurança básica
app.set('trust proxy', process.env.TRUST_PROXY ?? 'loopback');
app.use(helmet());

// Sessão
app.use(session({
  name: 'selynt.sid',
  secret: config.APP_SESSION_SECRET,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  },
  resave: false,
  saveUninitialized: false
}));

// Body parser e estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// View renderer (Mustache, sem engines externas)
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'base',       // base.html com {{{ body }}}
  viewExt: 'html',
  cache: false,
  debug: false
});

// Rotas
app.use(router);

app.listen(config.PORT, config.HOST, () => {
  console.log(`Application started at http://${config.HOST}:${config.PORT}`);
});