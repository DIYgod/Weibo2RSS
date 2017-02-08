var fetch = require('node-fetch');
var cheerio = require('cheerio');
var url = require('url');
var logger = require('../tools/logger');
// var redis = require('../tools/redis');

function getTime (html) {
    var math;
    var date = new Date();
    if (math = /(\d+)分钟前/.exec(html)) {
        date.setMinutes(date.getMinutes() - math[1]);
        return date.toUTCString();
    }
    else if (math = /今天 (\d+):(\d+)/.exec(html)) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), math[1], math[2]);
        return date.toUTCString();
    }
    else if (math = /(\d+)月(\d+)日 (\d+):(\d+)/.exec(html)) {
        date = new Date(date.getFullYear(), math[1] - 1, parseInt(math[2]), math[3], math[4]);
        return date.toUTCString();
    }
    return html;
}

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url,true).query;
    var debug = query.debug;

    var uid = req.params.uid;

    logger.info(`Weibo2RSS negative uid ${uid} form origin, IP: ${ip}`);

    fetch(`http://service.weibo.com/widget/widget_blog.php?uid=${uid}`).then(
        response => response.text()
    ).then((data) => {
            var $ = cheerio.load(data, {
                decodeEntities: false
            });
            var wbs = [];
            var items = $('.wgtCell');
            var name = $('.userNm').text();
            var wb, item, titleEle;
            var emotionCound = 0;

            items.map(function (index, ele) {
                wb = {};
                item = $(this);
                titleEle = item.find('.wgtCell_txt');
                wb.title = titleEle.text().replace(/^\s+|\s+$/g, '');
                if (wb.title.length > 24) {
                    wb.title = wb.title.slice(0, 24) + '...';
                }
                wb.description = titleEle.html().replace(/^\s+|\s+$/g, '').replace(/thumbnail/, 'large');
                wb.pubDate = getTime(item.find('.link_d').html());
                wb.link = item.find('.wgtCell_tm a').attr('href');
                wbs.push(wb);
            });
            for (let i = 0; i < wbs.length; i++) {
                fetch(`https://api.prprpr.me/emotion/wenzhi?password=DIYgod&text=${encodeURIComponent(wbs[i].description)}`).then(
                    response => response.json()
                ).then((data) => {
                    emotionCound++;
                    wbs[i].emotion = data.positive - data.negative;

                    if (emotionCound === wbs.length) {
                        var rss =
`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${name}的消极情绪微博</title>
<link>http://weibo.com/${uid}/</link>
<description>${name}的消极情绪微博RSS，使用 Weibo2RSS(https://github.com/DIYgod/Weibo2RSS) 构建</description>
<language>zh-cn</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<ttl>300</ttl>`
                        for (let j = 0; j < wbs.length; j++) {
                            if (wbs[j].emotion < 0) {
                                rss +=`
<item>
    <title><![CDATA[你关注的博主@${name} 发布了情绪值为${(wbs[j].emotion * 100).toFixed(4)}%的疑似消极情绪微博，快去关心一下吧：「${wbs[j].title}」]]></title>
    <description><![CDATA[${wbs[j].description}]]></description>
    <pubDate>${wbs[j].pubDate}</pubDate>
    <guid>${wbs[j].link}</guid>
    <link>${wbs[j].link}</link>
</item>`

                            }
                        }
                        rss += `
</channel>
</rss>`
                        res.send(rss);
                    }
                }).catch(
                    e => logger.error("Weibo2RSS negative Error: getting emotion", e)
                );
            }
        }
    ).catch(
        e => logger.error("Weibo2RSS negative Error: getting widget", e)
    );
};