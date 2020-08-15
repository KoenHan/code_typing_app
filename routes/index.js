var express = require('express');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();
const get_texts = require('./scrape.js');
const err_message = [
  '有効なアドレスを入力してください．',
  'コードを見つけられませんでした．URLを確認してください．'
]

router.get('/', (req, res, next) => {
  if (req.session.texts != undefined) {
    const texts = req.session.texts;
    const ext = req.session.ext;
    req.session.destroy();
    return res.render('play', { texts: texts, ext: ext });
  }
  let gh_url_se = false, upload_se = false;
  let gh_url_em = '', upload_em = '';
  if(req.session.gh_url_se != undefined || req.session.gh_url_se == true)
    gh_url_se = req.session.upload_se, gh_url_em = req.session.upload_em;
  if(req.session.upload_se != undefined || req.session.upload_se == true)
    upload_se = req.session.upload_se, upload_em = req.session.upload_em;

  console.log(upload_se);
  console.log(upload_em);
  return res.render('index', {
    gh_user_se: false,
    gh_url_se: gh_url_se,
    upload_se: upload_se,
    gh_user_em: '',
    gh_url_em: gh_url_em,
    upload_em: upload_em,
  });
});

const redirect = (res, req, err_mes) => {
  req.session.gh_url_se = true;
  req.session.gh_url_es = err_mes;
  return res.redirect('/');
}

router.post('/gh_user', async (req, res, next) => {
  let user_name = req.body.user_name;

  if(!user_name){
    req.session.gh_user_se = true;
    req.session.gh_user_em = 'test';
    return res.redirect('/');
  }

  return res.redirect('/');
});

router.post('/gh_url', async (req, res, next) => {
  let url = req.body.url;
  if(url == 'sample.cpp') url = 'https://github.com/KoenHan/code_typing_app/blob/feature/slight-adjustment/examples/sample.cpp';
  else if(url == 'sample.py') url = 'https://github.com/KoenHan/code_typing_app/blob/feature/slight-adjustment/examples/sample.py';

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
  console.log(texts);
  req.session.texts = texts;
  req.session.ext = ext;
  return res.redirect('/');
});

router.post('/upload', multer({dest: 'tmp/'}).single('file'), (req, res, next) => {
  if(req.file == undefined){
    req.session.upload_se = true;
    req.session.upload_em = 'ファイルを選択してください．';
    return res.redirect('/');
  }

  const dot_pos = req.file.originalname.lastIndexOf('.');
  if(dot_pos == -1 || dot_pos == req.file.originalname.length - 1){
    req.session.upload_se = true;
    req.session.upload_em = 'ファイル形式が正しいものを選択してください．';
    return res.redirect('/');
  }
  const ext = req.file.originalname.slice(dot_pos);
  const content = fs.readFileSync(req.file.path, 'utf-8');
  const texts = content.split('\n').map( row => {
    if(row == '') row = '\n';
    return row;
  });

  req.session.texts = texts;
  req.session.ext = ext;
  return res.redirect('/');
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
