var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 Weibo2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/rss/:uid', require('./routes/get'));
app.get('/negative/:uid', require('./routes/negative'));
app.listen(1206);