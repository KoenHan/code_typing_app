var express = require('express');
var router = express.Router();
const get_texts = require('./scrape.js');

// タイピングの練習を行うページ
router.post('/', async (req, res, next) => {
  const path = "[id^=LC]";
  const url = req.body.url;
  const texts = await get_texts(url, path);
  res.render('play', { title: 'Code Typing', texts: texts});
});

module.exports = router;
