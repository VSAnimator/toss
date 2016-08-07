'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const chalk = require('chalk');
const unirest = require('unirest');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/summarize', (req, res) => {

});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(chalk.blue('Server started on port', chalk.magenta(PORT))));
