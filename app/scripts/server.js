'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const watson = require('watson-developer-cloud');
const chalk = require('chalk');
const keys = require('../../../config'); // OB: consider using gitignore and/or environment variables instead of putting a config file entirely outside of the project folder. keeps your project self-contained to one folder

const app = express();
app.use(bodyParser.json());
app.use(cors());

const analyzer = watson.alchemy_language({
  api_key: keys.alchemyKey
});

app.get('/summarize/:url', (req, res) => {
  analyzer.combined({
    url: req.params.url,
    extract: 'doc-sentiment,keywords,concepts,taxonomy'
  }, (err, info) => {
    if (err) return res.status(500).json(err)
    delete info.usage
    delete info.totalTransactions
    res.json(info)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../options.html'))
})

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(chalk.blue('Server started on port', chalk.magenta(PORT))));
