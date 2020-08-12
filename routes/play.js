var express = require('express');
var router = express.Router();
const get_texts = require('./scrape.js');

// タイピングの練習を行うページ
router.post('/', async (req, res, next) => {
  const path = "[id^=LC]";
  const url = req.body.url;
  const texts = await get_texts(url, path);
<<<<<<< HEAD:routes/play.js
  res.render('play', { title: 'Code Typing', texts: texts, url: url});
=======
  res.render('play', { title: 'タイピング練習ページ', texts: texts, url: url});
>>>>>>> 9857b9c37087484f1117089e727a7f60538c6f47:code_typing_app/routes/play.js
});

module.exports = router;
