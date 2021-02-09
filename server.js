/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

app.use(compression());

const CSPHeader = `
    default-src 'self';
    connect-src https://ya-praktikum.tech wss://ya-praktikum.tech;
    font-src https://fonts.gstatic.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://ya-praktikum.tech https://ssl.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    script-src 'self' 'unsafe-inline';`;

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSPHeader.replace(/(\r\n|\n|\r| {2})/gm, ''));
  return next();
});

app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 3000;

console.log(`listening at ${port}`);

const server = app.listen(port);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutDown());
process.on('SIGINT', () => shutDown());
