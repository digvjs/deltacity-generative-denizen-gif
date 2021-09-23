const { basePath } = require('./lib/PathHelper')
const imgDir = `${basePath}/build`
var express = require('express')
var app = express()

var Gallery = require('express-photo-gallery')

var options = {
  title: 'My Awesome Degens'
};

app.use('/', Gallery(imgDir, options));

app.listen(3000, () => {
    console.log(`serving degens on port 3000....`)
});