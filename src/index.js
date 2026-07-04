#!/usr/bin/env node
/**
 * Multi-user in-memory Todo CLI
 * Requirements:
 *  - No persistence (memory only)
 *  - Multiple users with isolated lists
 *  - Commands: login, whoami, add, list, done, delete, help, logout
 *  - IDs: simple numeric counter per user
 *  - Max 10 active (pending) todos per user
 *  - List newest first, optional filter: all|pending|done
 *  - Core Node.js only (stdin/stdout)
 */

import readline from 'node:readline';
import process from 'node:process';



// ------------------------- State -------------------------
const state = {
  users: new Map(), // username -> { todos: Todo[], nextId: number }
  currentUser: null,
};

// ------------------------- Types -------------------------
/** @typedef {{ id:number, text:string, done:boolean, createdAt:number }} Todo */

// ------------------------- Utilities -------------------------
function ensureUser(username) {
  if (!state.users.has(username)) {
    state.users.set(username, { todos: [], nextId: 1 });
  }
  return state.users.get(username);
}

function requireLoggedIn() {
  if (!state.currentUser) {
    println('No user logged in. Use: login <username>');
    return false;
  }
  return true;
}

function println(msg = '') { process.stdout.write(String(msg) + '\n'); }
function prompt() { rl.prompt(true); }

function formatTodo(t) {
  const status = t.done ? '✓' : '•';
  const date = new Date(t.createdAt).toLocaleString();
  return `${t.id}. [${status}] ${t.text}  — ${date}`;
}

function getUserData() {
  return state.users.get(state.currentUser);
}

function parseAddText(input) {
  // Expect: add "<text>"
  // Allow: add <text>   (fallback, will join tokens)
  const quoteMatch = input.match(/^add\s+"([\s\S]*)"\s*$/i);
  if (quoteMatch) return quoteMatch[1].trim();
  const parts = input.split(/\s+/);
  parts.shift(); // remove 'add'
  return parts.join(' ').trim();
}

function parseListArg(input) {
  const m = input.trim().match(/^list(?:\s+(all|pending|done))?\s*$/i);
  return m ? (m[1] ? m[1].toLowerCase() : 'all') : null;
}

function parseIdArg(cmd, input) {
  const m = input.trim().match(new RegExp(`^${cmd}\\s+(\\d+)\\s*$`, 'i'));
  return m ? Number(m[1]) : null;
}

// ------------------------- Command Handlers -------------------------
function cmdLogin(line) {
  const m = line.match(/^login\s+([A-Za-z0-9._-]{1,32})\s*$/i);
  if (!m) { println('Usage: login <username>'); return; }
  const username = m[1];
  ensureUser(username);
  state.currentUser = username;
  println(`Logged in as: ${username}`);
}

function cmdWhoami() {
  if (!state.currentUser) { println('Not logged in.'); return; }
  println(state.currentUser);
}

function cmdLogout() {
  if (!state.currentUser) { println('Not logged in.'); return; }
  println(`Logged out: ${state.currentUser}`);
  state.currentUser = null;
}

function cmdAdd(line) {
  if (!requireLoggedIn()) return;
  const text = parseAddText(line);
  if (!text) { println('Error: todo text cannot be empty. Use: add "<text>"'); return; }
  const user = getUserData();
  const activeCount = user.todos.filter(t => !t.done).length;
  if (activeCount >= 10) { println('Error: Max 10 active todos per user. Complete or delete some first.'); return; }
  const todo = { id: user.nextId++, text, done: false, createdAt: Date.now() };
  user.todos.push(todo);
  println(`Added #${todo.id}`);
}

function cmdList(line) {
  if (!requireLoggedIn()) return;
  const arg = parseListArg(line);
  if (!arg) { println('Usage: list [all|pending|done]'); return; }
  const user = getUserData();
  let items = [...user.todos];
  if (arg === 'pending') items = items.filter(t => !t.done);
  else if (arg === 'done') items = items.filter(t => t.done);
  items.sort((a,b) => b.createdAt - a.createdAt); // newest first
  if (items.length === 0) { println('(no todos)'); return; }
  for (const t of items) println(formatTodo(t));
}

function cmdDone(line) {
  if (!requireLoggedIn()) return;
  const id = parseIdArg('done', line);
  if (id == null) { println('Usage: done <id>'); return; }
  const user = getUserData();
  const t = user.todos.find(t => t.id === id);
  if (!t) { println('Error: no todo with that id.'); return; }
  if (t.done) { println('Already marked done.'); return; }
  t.done = true;
  println(`Marked #${id} as done.`);
}

function cmdDelete(line) {
  if (!requireLoggedIn()) return;
  const id = parseIdArg('delete', line);
  if (id == null) { println('Usage: delete <id>'); return; }
  const user = getUserData();
  const idx = user.todos.findIndex(t => t.id === id);
  if (idx === -1) { println('Error: no todo with that id.'); return; }
  user.todos.splice(idx, 1);
  println(`Deleted #${id}.`);
}

function cmdHelp() {
  println(`Commands:
  login <username>        switch or create user
  whoami                  show current user
  add "<text>"            add a todo (quotes recommended)
  list [all|pending|done] list todos (newest first)
  done <id>               mark todo done
  delete <id>             remove todo
  logout                  logout current user
  help                    show this help
  exit | quit             exit program`);
}

// ------------------------- Router -------------------------
function handleLine(line) {
  const trimmed = line.trim();
  if (trimmed === '') return;
  if (/^login\b/i.test(trimmed)) return cmdLogin(trimmed);
  if (/^whoami\b/i.test(trimmed)) return cmdWhoami();
  if (/^logout\b/i.test(trimmed)) return cmdLogout();
  if (/^add\b/i.test(trimmed)) return cmdAdd(trimmed);
  if (/^list\b/i.test(trimmed)) return cmdList(trimmed);
  if (/^done\b/i.test(trimmed)) return cmdDone(trimmed);
  if (/^delete\b/i.test(trimmed)) return cmdDelete(trimmed);
  if (/^(help|h)\b/i.test(trimmed)) return cmdHelp();
  if (/^(exit|quit)\b/i.test(trimmed)) return shutdown();
  println('Unknown command. Type: help');
}

function banner() {
  println('Multi-User Todo CLI (memory only)');
  println('Tip: start with: login alice');
  println("Type 'help' for commands.\n");
}

function shutdown() {
  println('Goodbye!');
  rl.close();
}

// ------------------------- IO -------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });

rl.on('line', (line) => { try { handleLine(line); } catch (e) { println('Error: ' + e.message); } finally { prompt(); } });
rl.on('SIGINT', shutdown);
rl.on('close', () => process.exit(0));

// Start
banner();
prompt();
