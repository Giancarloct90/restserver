const express = require('express');
const app = express();

// es en este archivo donde se hace el requerimiento de todas las rutas  
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;