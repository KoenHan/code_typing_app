var express = require('express');
var multer = require('multer');
var fs = require('fs');
var github = require('octonode');
const get_texts = require('./scrape.js');
const C = require('./constant.js');

var router = express.Router();
var client = github.client();

router.post('/gh_user', async (req, res, next) => {
  if(!req.body.user_name.length){
    req.session.gh_user_se = true, req.session.gh_user_em = C['err_mes']['user'][0];
    return res.redirect('/');
  }
  const user_name = req.body.user_name;

  // repos一覧
  const repos = await new Promise(resolve => {
      client.get(`/users/${user_name}/repos`, {}, (err, status, body, headers) => {
        resolve(body);
      });
    });

  const repos_name = repos.map(repo => repo.name);
  console.log(repos_name);

  // ブランチ一覧
  const branches = await new Promise(resolve => {
    client.get(`/repos/${user_name}/${repos_name[2]}/branches`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  const branches_name = branches.map(branch => branch.name);
  console.log(branches_name);

  // フォルダ・ファイル一覧
  let contents = await new Promise(resolve => {
    client.get(`/repos/${user_name}/${repos_name[2]}/contents/`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  console.log(contents);

  contents = await new Promise(resolve => {
    client.get(`/repos/${user_name}/${repos_name[2]}/contents/views`, {}, (err, status, body, headers) => {
      resolve(body);
    });
  });
  console.log(contents);
  // const branches_name = branches.map(branch => branch.name);


  return res.redirect('/');
});

router.get('/cs', (req, res, next) => {
  req.session.destroy();
  return res.redirect('/');
});

module.exports = router;
