# Weibo2RSS

> 使用RSS订阅喜欢的微博博主

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/ucdjQF7wcNNiWY9mCEpAeGLz/DIYgod/Weibo2RSS'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/ucdjQF7wcNNiWY9mCEpAeGLz/DIYgod/Weibo2RSS.svg' />
</a>

## 介绍

Demo：https://api.prprpr.me/weibo/rss/3306934123

RSS 格式输出一个微博博主最新的 15 条微博，可以使用 RSS 阅读器来获取及时推送，配合 [IFTTT](https://ifttt.com/) 还可以实现更多好玩的功能。

Demo：https://api.prprpr.me/weibo/negative/3306934123

使用 [Text2Emotion](https://github.com/DIYgod/Text2Emotion) 实现，仅输出消极情绪的微博，用来监控博主的消极情绪。

## 使用

使用 RSS 阅读器订阅：https://api.prprpr.me/weibo/rss/{微博博主的uid}

获取uid：进入博主的微博主页，控制台执行
```js
/uid=(\d+)/. exec(document.querySelector('.opt_box .btn_bed').getAttribute('action-data'))[1]
```

## 搭建

需要环境：Node.js

推荐使用 Docker
```
docker build .
docker run --name Weibo2RSS -p 1206:1206 -d [CONTAINER ID]
```

## LICENSE

MIT © [DIYgod](http://github.com/DIYgod)