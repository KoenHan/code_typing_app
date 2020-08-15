var express = require('express');
var multer = require('multer');
var fs = require('fs');
var github = require('octonode');
const get_texts = require('./scrape.js');
const C = require('./constant.js');

var router = express.Router();
var client = github.client();

router.get('/repos', async (req, res, next) => {
  if(false) {
    // todo: user_name入れて何も見つからなかった場合のバリデーション
    return res.render('index', {
      gh_user_se: gh_user_se, gh_url_se: gh_url_se, upload_se: upload_se,
      gh_user_em: gh_user_em, gh_url_em: gh_url_em, upload_em: upload_em,
    });
  }
  const user_name = req.session.ghuser_name;

  // repos一覧
  const repos = await new Promise(resolve => {
      client.get(`/users/${req.session.ghuser_name}/repos`, {}, (err, status, body, headers) => {
        resolve(body);
      });
    });
  const repos_name = repos.map(repo => repo.name);
  // console.log(repos_name);
  return res.render('ch_list', {
    uri: '/chfile/repos/branches',
    items: repos_name,
    explain: 'リポジトリを選んでください．'
  });
});

router.get('/repos/branches', async (req, res, next) => {
  //todo: ブランチが見つからない場合のバリデーション

  // ブランチ一覧
  const branches = await new Promise(resolve => {
    client.get(`/repos/${req.session.ghuser_name}/${req.query.value}/branches`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  const branches_name = branches.map(branch => branch.name);
  // console.log(branches_name);
  req.session.repo = req.query.value;
  return res.render('ch_list', {
    uri: '/chfile/repos/branches/contents',
    items: branches_name,
    explain: 'ブランチを選んでください．'
  });
});

router.get('/repos/branches/contents', async (req, res, next) => {
  // フォルダ・ファイル一覧
  let contents = await new Promise(resolve => {
    client.get(`/repos/${req.session.ghuser_name}/${req.session.repo}/contents/`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  console.log(contents);
  const contents_name = contents.map(content => content.name);
  const contents_type = contents.map(content => content.type);
  const contents_url = contents.map(content => content.html_url);
  req.session.repo = req.query.value;
  return res.render('ch_list', {
    uri: '/chfile/repos/branches/contents',
    items: contents_name,
    explain: 'ファイルまたはフォルダを選んでください．'
  });
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
