const express = require('express');
const path = require('path');
const fs = require('fs');
const index = require('./routes/index');
const port = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/users/create');
});
app.use('/', index);

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
