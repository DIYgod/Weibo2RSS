var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "file",
            filename: 'logs/Weibo2RSS.log',
            maxLogSize: 20480,
            backups: 3,
            category: [ 'Weibo2RSS','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('Weibo2RSS');
logger.setLevel('INFO');

module.exports = logger;