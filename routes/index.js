var express = require('express');
var router = express.Router();
const get_texts = require('./scrape.js');
const err_message = [
  '有効なアドレスを入力してください．',
  '見つかりませんでした．URLを確認してください．'
]

router.get('/', (req, res, next) => {
  res.render('index', { show_err: false, err_message: '' });
});

const redirect = (res, err_mes) => {
  return res.render('index', {
    show_err: true,
    err_message: err_mes
  });
}

router.post('/', async (req, res, next) => {
  const url = req.body.url;
  const dot_pos = url.lastIndexOf('.');
  const slash_pos = url.lastIndexOf('/');
  if(!url || dot_pos <= slash_pos || slash_pos == -1) return redirect(res, err_message[0]);

  const ext = url.slice(dot_pos);
  if(ext.length == 1) return redirect(res, err_message[0]);

  const select_path = {
    'github' : '[id^=LC]'
  };
  const texts = await get_texts(url, select_path['github']);
  if(!texts.length) return redirect(res, err_message[1]);
  return res.render('play', { texts: texts, ext: ext});
});

module.exports = router;
