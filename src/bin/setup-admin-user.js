#!/usr/bin/env node
'use strict';

import prompts from 'prompts';
import crypto from 'crypto';
import config from '../config/index.js';
import { createAdminUser } from '../services/admin.service.js';

const username_regex = /^(?=.{4,}$)[a-zA-Z0-9_]+$/;
const password_regex = /^(?=.*\d)(?=.*[^\da-zA-Z])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const onCancel = () => { console.log('Bye Bye!'); process.exit(1); };

function randInt(max) { return crypto.randomInt(0, max); }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function genUsername(len = 12) {
  const first = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rest = first + '0123456789_';
  let out = first[randInt(first.length)];
  for (let i = 1; i < len; i++) out += rest[randInt(rest.length)];
  if (!username_regex.test(out)) return genUsername(len);
  return out;
}

function genPassword(len = 20) {
  if (len < 12) len = 12; // mínimo sensato
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  const all = lower + upper + digits + symbols;

  const pick = (set) => set[randInt(set.length)];
  const required = [pick(lower), pick(upper), pick(digits), pick(symbols)];

  const rest = [];
  for (let i = required.length; i < len; i++) rest.push(pick(all));

  const pwd = shuffle(required.concat(rest)).join('');
  if (!password_regex.test(pwd)) return genPassword(len); // garante complexidade
  return pwd;
}

(async () => {
  // Escolha do modo
  const { mode } = await prompts({
    type: 'select',
    name: 'mode',
    message: 'Credential mode',
    choices: [
      { title: 'Manual', value: 'manual' },
      { title: 'Auto-generate (secure)', value: 'auto' }
    ],
    initial: 1
  }, { onCancel });

  let username, password;

  if (mode === 'manual') {
    const questions = [
      {
        type: 'text',
        name: 'username',
        message: 'App Username',
        validate: (v) => {
          v = String(v || '').trim();
          if (!v) return 'App username is required';
          if (v.length < 4) return 'App username must have at least 4 characters';
          if (!username_regex.test(v)) return 'Only letters, numbers and underscore';
          return true;
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'App Password',
        validate: (v) => {
          v = String(v || '').trim();
          if (!v) return 'App password is required';
          if (v.length < 8) return 'Min 8 characters';
          if (!password_regex.test(v)) return 'Must have symbol, upper, lower and number';
          return true;
        }
      }
    ];
    const resp = await prompts(questions, { onCancel });
    username = resp.username.trim();
    password = resp.password.trim();
  } else {
    // Auto-generate com reroll
    while (true) {
      username = genUsername(12);
      password = genPassword(24);
      console.log('\nGenerated credentials:');
      console.log('  username:', username);
      console.log('  password:', password);

      const { keep } = await prompts({
        type: 'toggle',
        name: 'keep',
        message: 'Use these credentials?',
        initial: true,
        active: 'Yes',
        inactive: 'Re-generate'
      }, { onCancel });
      if (keep) break;
    }
  }

  const { agreed } = await prompts({
    type: 'confirm',
    name: 'agreed',
    message: 'Confirm to create/update admin user?',
    initial: true
  }, { onCancel });

  if (agreed) {
    await createAdminUser(username, password);
    console.log('Admin user created/updated successfully.');
  } else {
    console.log('Operation cancelled.');
  }
})();