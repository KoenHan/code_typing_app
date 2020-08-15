var express = require('express');
var multer = require('multer');
var fs = require('fs');
var github = require('octonode');
const get_texts = require('./scrape.js');
const C = require('./constant.js');

var router = express.Router();
var client = github.client();

router.get('/', (req, res, next) => {
  if (req.session.texts != undefined) {
    const texts = req.session.texts;
    const ext = req.session.ext;
    req.session.destroy();
    return res.render('play', { texts: texts, ext: ext});
  }

  let gh_user_se = false, gh_url_se = false, upload_se = false;
  let gh_user_em = '', gh_url_em = '', upload_em = '';
  if(req.session.gh_user_se != undefined || req.session.gh_user_se == true)
    gh_user_se = req.session.gh_user_se, gh_user_em = req.session.gh_user_em;
  if(req.session.gh_url_se != undefined || req.session.gh_url_se == true)
    gh_url_se = req.session.gh_url_se, gh_url_em = req.session.gh_url_em;
  if(req.session.upload_se != undefined || req.session.upload_se == true)
    upload_se = req.session.upload_se, upload_em = req.session.upload_em;

  return res.render('index', {
    gh_user_se: gh_user_se, gh_url_se: gh_url_se, upload_se: upload_se,
    gh_user_em: gh_user_em, gh_url_em: gh_url_em, upload_em: upload_em,
  });
});

router.post('/gh_user', async (req, res, next) => {
  if(!req.body.user_name.length){
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['user'][0];
    return res.redirect('/');
  }

  req.session.ghuser_name = req.body.user_name;

  return res.redirect('/chfile/repos');
});

router.post('/gh_url', async (req, res, next) => {
  let url = req.body.url;
  if(url == "sample.cpp") url = C['sample_url']['cpp'];
  else if(url == "sample.py") url = C['sample_url']['py'];

  const dot_pos = url.lastIndexOf('.');
  const slash_pos = url.lastIndexOf('/');
  if(!url.length || dot_pos <= slash_pos || slash_pos == -1){
    req.session.gh_url_se = true, req.session.gh_url_em = C['err_mes']['url'][0];
    return res.redirect('/');
  }

  const ext = url.slice(dot_pos+1);
  if(!ext.length) {
    req.session.gh_url_se = true, req.session.gh_url_em = C['err_mes']['url'][0];
    return res.redirect('/');
  }

  const texts = await get_texts(url, C['select_path']['github']);
  if(!texts.length) {
    req.session.gh_url_se = true, req.session.gh_url_em = C['err_mes']['url'][1];
    return res.redirect('/');
  }
  req.session.texts = texts;
  req.session.ext = ext;
  return res.redirect('/');
});

router.post('/upload', multer({dest: 'tmp/'}).single('file'), (req, res, next) => {
  if(req.file == undefined){
    req.session.upload_se = true, req.session.upload_em = C['err_mes']['upload'][0];
    return res.redirect('/');
  }

  const dot_pos = req.file.originalname.lastIndexOf('.');
  if(dot_pos == -1 || dot_pos == req.file.originalname.length - 1){
    req.session.upload_se = true, req.session.upload_em = C['err_mes']['upload'][1];
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
