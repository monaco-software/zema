/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const express = require('express');
const path = require('path');
const csp = require("./middlewares/csp");
const compression = require('compression');
const enforce = require('express-sslify');

const app = express();

app.use(compression());

app.use(csp.cspHeader)

app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/dist/index.html'));
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
