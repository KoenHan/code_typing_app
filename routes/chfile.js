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
  return res.render('ch_branch', {
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
  return res.render('ch_branch', {
    uri: '/chfile/repos/branches/contents',
    items: branches_name,
    explain: 'ブランチを選んでください．'
  });
});

router.get('/repos/branches/contents', async (req, res, next) => {
  if(req.query.type == 'file') {
    // const url = contents_url[?];
    const url = req.session.contents_data.find(cdata => cdata.name == req.query.name).url;
    console.log(url);
    req.session.texts = await get_texts(url, C['select_path']['github']);
    req.session.ext = url.slice(url.lastIndexOf('.') + 1);
    return res.redirect('/');
  }
  if(req.session.path != undefined) {
    req.session.path += `/${req.query.name}`;
  } else {
    req.session.path = '';
  }

  // フォルダ・ファイル一覧
  const contents = await new Promise(resolve => {
    // warning : /contents/ -> /contents に変えた
    client.get(
      `/repos/${req.session.ghuser_name}/${req.session.repo}/contents${req.session.path}`,
      {}, (err, status, body, headers) => {
        resolve(body);
    });
  });
  console.log(contents);
  // const contents_name = contents.map(content => content.name);
  // const contents_type = contents.map(content => content.type);
  // const contents_url = contents.map(content => content.html_url);
  const contents_data = contents.map(content => {
    const obj = {
      name : content.name,
      type : content.type,
      url : content.html_url
    };
    return obj;
  });
  req.session.contents_data = contents_data;

  return res.render('ch_content', {
    uri: '/chfile/repos/branches/contents',
    items: contents_data,
    explain: 'ファイルまたはフォルダを選んでください．'
  });
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
