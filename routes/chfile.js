var express = require('express');
var github = require('octonode');
const get_texts = require('./scrape.js');
const C = require('./constant.js');

var router = express.Router();
var client = github.client();

const get_rate_limits = async () => {
  return new Promise(resolve => {
    client.limit(function (err, left, max, reset) {
      resolve(left);
      // console.log(reset);  // 1372700873 (UTC epoch seconds)
    });
  });
}

router.get('/repos', async (req, res, next) => {
  const rate_limits = await get_rate_limits();
  console.log(rate_limits);
  if(!rate_limits) {
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['api'];
    return res.redirect('/');
  }
  const repos = await new Promise(resolve => {
      client.get(`/users/${req.session.ghuser_name}/repos`, {}, (err, status, body, headers) => {
        resolve(body);
      });
    });

  // ユーザーが見つからない場合のバリデーション（リポジトリがない＝ユーザー名が間違ってる）
  if(repos == undefined || !repos.length) {
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['user'][1];
    return res.redirect('/');
  }

  let content_se = false, content_em = '';
  if(req.session.content_se != undefined || req.session.content_se == true)
    content_se = req.session.content_se, content_em = req.session.content_em;
  const repos_name = repos.map(repo => repo.name);
  return res.render('ch_branch', {
    uri: '/chfile/repos/branches',
    items: repos_name,
    explain: C['explain']['repo'],
    content_se: content_se,
    content_em: content_em
  });
});

router.get('/repos/branches', async (req, res, next) => {
  const rate_limits = await get_rate_limits();
  console.log(rate_limits);
  if(!rate_limits) {
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['api'];
    return res.redirect('/');
  }

  const branches = await new Promise(resolve => {
    client.get(`/repos/${req.session.ghuser_name}/${req.query.value}/branches`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  console.log(branches);

  //リポジトリが見つからない場合のバリデーション（ブランチがない＝リポジトリが間違ってる）
  if( branches == undefined || !branches.length){
    req.session.content_se = true, req.session.content_em = C['err_mes']['repo'];
    return res.redirect('/chfile/repos');
  }

  const branches_name = branches.map(branch => branch.name);
  req.session.repo = req.query.value;

  let content_se = false, content_em = '';
  if(req.session.content_se != undefined || req.session.content_se == true)
    content_se = req.session.content_se, content_em = req.session.content_em;
  return res.render('ch_branch', {
    uri: '/chfile/repos/branches/contents',
    items: branches_name,
    explain: C['explain']['branch'],
    content_se: content_se,
    content_em: content_em
  });
});

router.get('/repos/branches/contents', async (req, res, next) => {
  const rate_limits = await get_rate_limits();
  console.log(rate_limits);
  if(!rate_limits) {
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['api'];
    return res.redirect('/');
  }

  if(req.query.type == 'file') {
    const url = req.session.contents_data.find(cdata => cdata.name == req.query.name).url;

    // ファイルが見つからない場合のバリデーション
    // if (url == undefined) {
    //   req.session.content_se = true, req.session.content_em = C['err_mes']['file'];
    //   return res.redirect('/chfile/repos/contents');
    // }

    req.session.texts = await get_texts(url, C['select_path']['github']);
    req.session.ext = url.slice(url.lastIndexOf('.') + 1);
    return res.redirect('/');
  }

  if(req.session.path != undefined) req.session.path += `/${req.query.name}`;
  else req.session.path = '';

  const contents = await new Promise(resolve => {
    client.get(
      `/repos/${req.session.ghuser_name}/${req.session.repo}/contents${req.session.path}?ref=${req.query.value}`,
      {}, (err, status, body, headers) => {
        resolve(body);
    });
  });

  //ブランチかpathが見つからない場合のバリデーション（contentがない＝ブランチかpathが間違ってる）
  // if (contents == undefined || !contents.length) {
  //   req.session.content_se = true;
  //   if (req.session.path.length) {
  //     req.session.path = req.session.path.slice(0, req.session.path.length - req.session.path.lastIndexOf('/'));
  //     req.session.content_em = C['err_mes']['dir'];
  //     return res.redirect('/chfile/repos/contents');
  //   } else {
  //     req.session.content_em = C['err_mes']['branch'];
  //     return res.redirect('/chfile/repos/branches');
  //   }
  // }

  const contents_data = contents.map(content => {
    const obj = {
      name : content.name,
      type : content.type,
      url : content.html_url
    };
    return obj;
  });
  req.session.contents_data = contents_data;
  req.session.branch = req.query.value;

  let content_se = false, content_em = '';
  // if(req.session.content_se != undefined || req.session.content_se == true)
  //   content_se = req.session.content_se, content_em = req.session.content_em;
  return res.render('ch_content', {
    uri: '/chfile/repos/branches/contents',
    items: contents_data,
    explain: C['explain']['content'],
    content_se: content_se,
    content_em: content_em
  });
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
