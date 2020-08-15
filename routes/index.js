var express = require('express');
var router = express.Router();
const get_texts = require('./scrape.js');
const err_message = [
  '有効なアドレスを入力してください．',
  'コードを見つけられませんでした．URLを確認してください．'
]

router.get('/', (req, res, next) => {
  if (req.session.texts != undefined) {
    return res.render('play', { texts: req.session.texts, ext: req.session.ext });
  }
  if(req.session.show_err != undefined || req.session.show_err == true) {
    return res.render('index', {
      show_err: req.session.show_err,
      err_mes: req.session.err_mes,
    });
  }
  return res.render('index', { show_err: false, err_message: ''});
});

const redirect = (res, req, err_mes) => {
  req.session.show_err = true;
  req.session.err_mes = err_mes;
  return res.redirect('/');
}

router.post('/', async (req, res, next) => {
  let url = req.body.url;
  if(url == "sample.cpp") url = "https://github.com/KoenHan/code_typing_app/blob/master/examples/sample.cpp";
  else if(url == "sample.py") url = "https://github.com/KoenHan/code_typing_app/blob/master/examples/sample.py";

  const dot_pos = url.lastIndexOf('.');
  const slash_pos = url.lastIndexOf('/');
  if(!url || dot_pos <= slash_pos || slash_pos == -1)
    return redirect(res, req, err_message[0]);

  const ext = url.slice(dot_pos);
  if(ext.length == 1) return redirect(res, req, err_message[0]);

  const select_path = {
    'github' : '[id^=LC]'
  };
  const texts = await get_texts(url, select_path['github']);
  if(!texts.length) return redirect(res, req, err_message[1]);
  req.session.texts = texts;
  req.session.ext = ext;
  return res.redirect('/');
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
