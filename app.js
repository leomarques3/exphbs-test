const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment');
const path = require('path');
const pdf = require('html-pdf');
const data = require('./database.json');

const app = express();
const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  helpers: {
    dateFormat: function(value, format) {return moment(value).format(format)}
  }
});

const pdfOptions = {
  view: path.join(__dirname, './views') + '/home.hbs',
  format: 'A4',
  base: 'file://' + path.join(__dirname, '/public') + '/'
};

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/pdf', (req, res) => {
  var options = Object.assign({}, data, {pdf: true});
  hbs.renderView('views/home.hbs', options, function(err, html) {
    console.log(html);
    pdf.create(html, pdfOptions).toStream(function(err, stream) {
      console.log(stream);
      stream.pipe(res);
    });
  });
});

app.listen(3000);