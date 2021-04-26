// Этот скрипт предназначен для разработки
// запускает два потока сборки и WS сервер
// для перезагрузки страниц
// запуск node scripts/dev.js

const WebSocket = require('ws');
const webpack = require('webpack');
const webpackConfig = require('../webpack.ssr.js');
const cluster = require('cluster');
const { spawn } = require('child_process');

const RELOAD_MESSAGE = 'restart sharply';

const statsConfig = {
  all: false,
  entrypoints: true,
  chunkGroups: true,
  timings: true,
  errors: true,
  colors: true,
};

const compilers = [];
let postgres;
webpackConfig.forEach((config) => {
  compilers.push(webpack(config));
});

const spawnPostgres = () => {
  return spawn('docker-compose', ['up', 'postgres'], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    env: { ...process.env },
  });
};

if (cluster.isMaster) {
  console.log(
    `🔧\x1b[1m\x1b[33m process.env.NODE_ENV = '\x1b[96m${process.env.NODE_ENV}\x1b[33m'\x1b[0m\n`
  );

  postgres = spawnPostgres();
  postgres.stderr.on('data', (data) => {
    process.stdout.write(`⚡ ${data}`);
  });

  const wsConnections = [];
  let wsServer;

  wsServer = new WebSocket.Server({ port: 54321 });
  wsServer.on('connection', (connection) => {
    wsConnections.push(connection);
    connection.on('message', (message) => {
      console.log(`📜 ️received: ${message}`);
    });
    connection.send('🛠 Reload WebSocket connected 🛠');
  });

  const shutDown = () => {
    if (wsConnections.length) {
      wsConnections.forEach((connection) => {
        if (connection && connection.readyState === 1) {
          connection.send('🛠 Reload WebSocket disconnected 🛠');
          connection.close();
        }
      });
    }
    setInterval(() => {
      if (!postgres.connected) {
        process.exit(0);
      }
    }, 100);
  };

  const messageListener = (msg) => {
    if (msg.data === RELOAD_MESSAGE) {
      console.log(`Message received to master from worker: ${msg.data}`);
      setTimeout(() => {
        wsConnections.forEach((connection) => {
          if (connection && connection.readyState === 1) {
            connection.send('reload');
          }
        });
      }, 2000);
    }
  };

  compilers.forEach((compiler, id) => {
    const worker = cluster.fork({ id, name: compiler.name });
    worker.on('message', (msg) => messageListener(msg));
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  process.on('SIGTERM', () => shutDown());
  process.on('SIGINT', () => shutDown());
} else {
  compilers[process.env.id].watch(
    {
      ignored: /node_modules/,
      aggregateTimeout: 500,
      poll: 500,
    },
    (err, stats) => {
      if (stats) {
        console.log(stats.toString(statsConfig));
        if (process.env.name === 'client') {
          process.send({ data: RELOAD_MESSAGE });
        }
      }
      if (err) {
        console.error(err);
      }
    }
  );
  console.log(`Worker '${process.env.name}' ${process.pid} started`);
}
