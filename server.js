'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { TaskStore } = require('./src/task-store');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'public');
const store = new TaskStore([
  { id: 1, title: 'Read the project requirements', status: 'todo', createdAt: new Date().toISOString() },
  { id: 2, title: 'Review the API', status: 'doing', createdAt: new Date().toISOString() },
  { id: 3, title: 'Run the automated tests', status: 'done', createdAt: new Date().toISOString() }
]);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new SyntaxError('Request body must be valid JSON.'));
      }
    });
    request.on('error', reject);
  });
}

function serveStatic(request, response) {
  const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(PUBLIC_DIR, `.${requestedPath}`);
  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`) && filePath !== path.join(PUBLIC_DIR, 'index.html')) {
    response.writeHead(403);
    return response.end('Forbidden');
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(404);
      return response.end('Not found');
    }
    const extension = path.extname(filePath);
    const contentType = extension === '.css' ? 'text/css; charset=utf-8'
      : extension === '.js' ? 'text/javascript; charset=utf-8'
        : 'text/html; charset=utf-8';
    response.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(contents);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (url.pathname === '/api/health' && request.method === 'GET') {
    return sendJson(response, 200, { status: 'ok' });
  }

  if (url.pathname === '/api/tasks' && request.method === 'GET') {
    return sendJson(response, 200, { tasks: store.list() });
  }

  if (url.pathname === '/api/tasks' && request.method === 'POST') {
    try {
      const body = await readJson(request);
      const task = store.create(body);
      return sendJson(response, 201, { task });
    } catch (error) {
      const status = error instanceof SyntaxError ? 400 : 422;
      return sendJson(response, status, { error: error.message });
    }
  }

  const taskMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch && request.method === 'PATCH') {
    try {
      const body = await readJson(request);
      const task = store.update(taskMatch[1], body);
      if (!task) return sendJson(response, 404, { error: 'Task not found.' });
      return sendJson(response, 200, { task });
    } catch (error) {
      const status = error instanceof SyntaxError ? 400 : 422;
      return sendJson(response, status, { error: error.message });
    }
  }

  if (taskMatch && request.method === 'DELETE') {
    const removed = store.remove(taskMatch[1]);
    if (!removed) return sendJson(response, 404, { error: 'Task not found.' });
    response.writeHead(204);
    return response.end();
  }

  if (url.pathname.startsWith('/api/')) {
    return sendJson(response, 404, { error: 'API route not found.' });
  }

  if (request.method !== 'GET') {
    response.writeHead(405);
    return response.end('Method not allowed');
  }
  serveStatic(request, response);
});

server.listen(PORT, HOST, () => {
  console.log(`TaskFlow QA Lab running at http://${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
