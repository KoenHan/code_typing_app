var express = require('express');
var router = express.Router();
const get_texts = require('./scrape.js');

router.get('/', (req, res, next) => {
  res.render('index', { show_err: false, err_message: '' });
});

router.post('/', async (req, res, next) => {
  const url = req.body.url;
  const dot_pos = url.lastIndexOf('.');
  const slash_pos = url.lastIndexOf('/');
  if(dot_pos < slash_pos) {
    res.render('index', {
      show_err: true,
      err_message: '有効なアドレスを入力してください．'
    });
  } else {
    const ext = url.slice(dot_pos);
    console.log(ext);
    const select_path = {
      'github' : '[id^=LC]'
    };
    const texts = await get_texts(url, select_path['github']);
    res.render('play', { texts: texts, ext: ext});
  }
});

module.exports = router;
